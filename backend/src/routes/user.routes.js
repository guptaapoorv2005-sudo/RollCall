import { Router } from "express";
import { changePassword, deleteUser, getCurrentUser, loginUser, logoutUser, registerUser, updateName, refreshAccessToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/update-name").patch(verifyJWT, updateName);

router.route("/change-password").patch(verifyJWT, changePassword);

router.route("/delete").delete(verifyJWT, deleteUser);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/refresh-token").post(refreshAccessToken);

export default router;