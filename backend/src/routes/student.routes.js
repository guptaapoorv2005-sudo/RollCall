import { Router } from "express";
import { getMyAttendance } from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { rollCheck } from "../middlewares/rollCheck.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(rollCheck("STUDENT"));

router.route("/attendance/me").get(getMyAttendance);

export default router;