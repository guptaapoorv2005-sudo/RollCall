import { Router } from "express";
import { markAttendance } from "../controllers/teacher.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { rollCheck } from "../middlewares/rollCheck.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(rollCheck("TEACHER"));

router.route("/attendance/mark").post(markAttendance);

export default router;