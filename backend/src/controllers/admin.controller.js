import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

const createSubject = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if(!name?.trim()) {
        throw new ApiError(400, "Subject name is required");
    }

    const existingSubject = await prisma.subject.findUnique({ where: { name } });
    if(existingSubject) {
        throw new ApiError(400, "Subject with this name already exists");
    }

    await prisma.subject.create({ data: { name } });
    return res
        .status(201)
        .json(new ApiResponse(201, null, "Subject created successfully"));
});

const deleteSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id) {
        throw new ApiError(400, "Subject ID is required");
    }

    await prisma.subject.delete({ where: { id } });
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Subject deleted successfully"));
});

const updateSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if(!id) {
        throw new ApiError(400, "Subject ID is required");
    }
    if(!name?.trim()) {
        throw new ApiError(400, "Subject name is required");
    }
    await prisma.subject.update({ where: { id }, data: { name } });
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Subject updated successfully"));
});

const getSubjects = asyncHandler(async (req, res) => {
    const subjects = await prisma.subject.findMany();
    return res
        .status(200)
        .json(new ApiResponse(200, subjects, "Subjects retrieved successfully", subjects));
});

const createClass = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if(!name?.trim()) {
        throw new ApiError(400, "Class name is required");
    }
    await prisma.class.create({ data: { name } });
    return res
        .status(201)
        .json(new ApiResponse(201, null, "Class created successfully"));
});

const deleteClass = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id) {
        throw new ApiError(400, "Class ID is required");
    }
    await prisma.class.delete({ where: { id } });
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Class deleted successfully"));
});

const updateClass = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if(!id) {
        throw new ApiError(400, "Class ID is required");
    }
    if(!name?.trim()) {
        throw new ApiError(400, "Class name is required");
    }
    await prisma.class.update({ where: { id }, data: { name } });
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Class updated successfully"));
});

const getClasses = asyncHandler(async (req, res) => {
    const classes = await prisma.class.findMany();
    return res
        .status(200)
        .json(new ApiResponse(200, classes, "Classes retrieved successfully", classes));
});

const createTeachingAssignment = asyncHandler(async (req, res) => {
    const { teacherId, subjectId, classId } = req.body;
    if(!teacherId) {
        throw new ApiError(400, "Teacher ID is required");
    }
    if(!subjectId) {
        throw new ApiError(400, "Subject ID is required");
    }
    if(!classId) {
        throw new ApiError(400, "Class ID is required");
    }

    const existingTeacher = await prisma.user.findFirst({ where: { id: teacherId, role: 'TEACHER' } });
    if(!existingTeacher) {
        throw new ApiError(404, "Teacher not found");
    }

    const existingSubject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if(!existingSubject) {
        throw new ApiError(404, "Subject not found");
    }

    const existingClass = await prisma.class.findUnique({ where: { id: classId } });
    if(!existingClass) {
        throw new ApiError(404, "Class not found");
    }

    try {
        await prisma.teachingAssignment.create({ data: { teacherId, subjectId, classId } });
    } catch (error) {
        if (error.code === 'P2002') {
            throw new ApiError(409, "This teaching assignment already exists");
        }
        throw new ApiError(500, "An error occurred while creating the teaching assignment");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, null, "Teaching assignment created successfully"));
});

const getTeachingAssignments = asyncHandler(async (req, res) => {
    const assignments = await prisma.teachingAssignment.findMany({
        include: {
            teacher: true,
            subject: true,
            class: true
        }
    });
    return res
        .status(200)
        .json(new ApiResponse(200, assignments, "Teaching assignments retrieved successfully", assignments));
});


export {
    createSubject,
    deleteSubject,
    updateSubject,
    getSubjects,
    createClass,
    deleteClass,
    updateClass,
    getClasses,
    createTeachingAssignment,
    getTeachingAssignments
};