import { Router } from "express";
import { getUserProfile, userLogin } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/auth/login").post(userLogin);
userRouter.route("/profile").get(verifyJWT, getUserProfile);

export default userRouter;
