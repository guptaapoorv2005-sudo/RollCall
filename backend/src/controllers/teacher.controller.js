import { AttendanceStatus, Role } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../utils/prismaClient.js";

const normalizeToUtcDateStart = (inputDate) => {
    const parsedDate = new Date(inputDate);

    if (Number.isNaN(parsedDate.getTime())) {
        throw new ApiError(400, "Invalid date format");
    }

    return new Date(Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate()
    ));
};

const getAssignments = asyncHandler(async (req, res) => {
    const assignments = await prisma.teachingAssignment.findMany({
        where: {
            teacherId: req.user.id
        },
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
        },
        orderBy: [
            {
                class: {
                    name: "asc"
                }
            },
            {
                subject: {
                    name: "asc"
                }
            }
        ]
    });

    return res
        .status(200)
        .json(new ApiResponse(200, assignments, "Assignments retrieved successfully"));
});

const getStudentsByAssignment = asyncHandler(async (req, res) => {
    const assignmentId = req.params.assignmentId?.trim();

    if (!assignmentId) {
        throw new ApiError(400, "Assignment ID is required");
    }

    const assignment = await prisma.teachingAssignment.findFirst({
        where: {
            id: assignmentId,
            teacherId: req.user.id
        },
        select: {
            classId: true
        }
    });

    if (!assignment) {
        throw new ApiError(404, "Teaching assignment not found");
    }

    const students = await prisma.user.findMany({
        where: {
            classId: assignment.classId,
            role: Role.STUDENT
        },
        select: {
            id: true,
            name: true,
            email: true,
            classId: true
        },
        orderBy: {
            name: "asc"
        }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, students, "Students retrieved successfully"));
});

const getStudentsByClass = asyncHandler(async (req, res) => {
    const classId = req.params.classId?.trim() || req.query.classId?.trim();

    if (!classId) {
        throw new ApiError(400, "Class ID is required");
    }

    const classAssignment = await prisma.teachingAssignment.findFirst({
        where: {
            teacherId: req.user.id,
            classId
        },
        select: {
            id: true
        }
    });

    if (!classAssignment) {
        throw new ApiError(403, "You are not assigned to this class");
    }

    const students = await prisma.user.findMany({
        where: {
            classId,
            role: Role.STUDENT
        },
        select: {
            id: true,
            name: true,
            email: true,
            classId: true
        },
        orderBy: {
            name: "asc"
        }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, students, "Students retrieved successfully"));
});

const markAttendance = asyncHandler(async (req, res) => {
    const { assignmentId, date, records } = req.body;

    if (!assignmentId?.trim()) {
        throw new ApiError(400, "Assignment ID is required");
    }

    if (!date) {
        throw new ApiError(400, "Date is required");
    }

    if (!Array.isArray(records) || records.length === 0) {
        throw new ApiError(400, "records must be a non-empty array");
    }

    const assignment = await prisma.teachingAssignment.findFirst({
        where: {
            id: assignmentId,
            teacherId: req.user.id
        },
        select: {
            id: true,
            classId: true
        }
    });

    if (!assignment) {
        throw new ApiError(403, "You are not allowed to mark attendance for this assignment");
    }

    const normalizedDate = normalizeToUtcDateStart(date);

    const seenStudentIds = new Set();
    const normalizedRecords = records.map((record, index) => {
        const studentId = record?.studentId?.trim();
        const status = record?.status;

        if (!studentId) {
            throw new ApiError(400, `studentId is required at records[${index}]`);
        }

        if (seenStudentIds.has(studentId)) {
            throw new ApiError(400, `Duplicate studentId in records: ${studentId}`);
        }
        seenStudentIds.add(studentId);

        if (![AttendanceStatus.PRESENT, AttendanceStatus.ABSENT].includes(status)) {
            throw new ApiError(400, `Invalid attendance status at records[${index}]`);
        }

        return {
            studentId,
            status
        };
    });

    const studentIds = normalizedRecords.map((record) => record.studentId);
    const students = await prisma.user.findMany({
        where: {
            id: {
                in: studentIds
            }
        },
        select: {
            id: true,
            role: true,
            classId: true
        }
    });

    if (students.length !== studentIds.length) {
        throw new ApiError(404, "One or more students were not found");
    }

    const studentMap = new Map(students.map((student) => [student.id, student]));

    for (const record of normalizedRecords) {
        const student = studentMap.get(record.studentId);

        if (student.role !== Role.STUDENT) {
            throw new ApiError(400, `User ${record.studentId} is not a student`);
        }

        if (student.classId !== assignment.classId) {
            throw new ApiError(400, `Student ${record.studentId} does not belong to this class`);
        }
    }

    await prisma.$transaction(
        normalizedRecords.map((record) => prisma.attendance.upsert({
            where: {
                studentId_assignmentId_date: {
                    studentId: record.studentId,
                    assignmentId,
                    date: normalizedDate
                }
            },
            create: {
                studentId: record.studentId,
                assignmentId,
                date: normalizedDate,
                status: record.status
            },
            update: {
                status: record.status
            }
        }))
    );

    return res.status(200).json(
        new ApiResponse(200, {
            assignmentId,
            date: normalizedDate,
            processedCount: normalizedRecords.length
        }, "Attendance marked successfully")
    );
});

export {
    getAssignments,
    getStudentsByAssignment,
    getStudentsByClass,
    markAttendance
};