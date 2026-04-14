import { Router } from "express";
import { toggleProjectLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:projectId").post(verifyJWT, toggleProjectLike);

export default router;