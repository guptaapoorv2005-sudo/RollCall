import { AttendanceStatus, PrismaClient } from "@prisma/client";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const prisma = new PrismaClient();

const getMyAttendance = asyncHandler(async (req, res) => {
    const studentId = req.user.id;

    const attendanceRows = await prisma.attendance.findMany({
        where: {
            studentId
        },
        include: {
            assignment: {
                include: {
                    subject: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    class: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            date: "desc"
        }
    });

    const records = attendanceRows.map((row) => ({
        id: row.id,
        assignmentId: row.assignmentId,
        date: row.date,
        status: row.status,
        subject: row.assignment.subject,
        class: row.assignment.class
    }));

    const total = records.length;
    const present = records.filter((record) => record.status === AttendanceStatus.PRESENT).length;
    const absent = total - present;
    const percentage = total === 0 ? 0 : Number(((present / total) * 100).toFixed(2));

    return res.status(200).json(new ApiResponse(200, {
        summary: {
            total,
            present,
            absent,
            percentage
        },
        records
    }, "Student attendance fetched successfully"));
});

export {
    getMyAttendance
};