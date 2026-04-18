import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { rollCheck } from "../middlewares/rollCheck.middleware.js";
import { createClass, createSubject, createTeacher, createTeachingAssignment, deleteClass, deleteSubject, getClasses, getSubjects, getTeachers, getTeachingAssignments, updateClass, updateSubject } from "../controllers/admin.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(rollCheck("ADMIN"));

router.route("/subjects")
    .post(createSubject)
    .get(getSubjects);

router.route("/subjects/:id")
    .delete(deleteSubject)
    .patch(updateSubject);

router.route("/classes")
    .post(createClass)
    .get(getClasses);

router.route("/classes/:id")
    .delete(deleteClass)
    .patch(updateClass);

router.route("/teachers")
    .post(createTeacher)
    .get(getTeachers);

router.route("/teaching-assignments")
    .post(createTeachingAssignment)
    .get(getTeachingAssignments);

export default router;