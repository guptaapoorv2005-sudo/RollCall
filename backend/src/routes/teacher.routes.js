import { Router } from "express";
import {
	getAssignments,
	getStudentsByAssignment,
	getStudentsByClass,
	markAttendance,
} from "../controllers/teacher.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { rollCheck } from "../middlewares/rollCheck.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(rollCheck("TEACHER"));

router.route("/assignments").get(getAssignments);
router.route("/teaching-assignments").get(getAssignments);

router.route("/assignments/:assignmentId/students").get(getStudentsByAssignment);
router.route("/classes/:classId/students").get(getStudentsByClass);
router.route("/students").get(getStudentsByClass);

router.route("/attendance/mark").post(markAttendance);

export default router;