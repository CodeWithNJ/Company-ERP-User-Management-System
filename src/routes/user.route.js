import { Router } from "express";
import {
  createNewUser,
  getAllUsers,
  getUserProfile,
  userLogin,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/auth/login").post(userLogin);
userRouter.route("/profile").get(verifyJWT, getUserProfile);
userRouter.route("/").post(verifyJWT, createNewUser);
userRouter.route("/").get(verifyJWT, getAllUsers);

export default userRouter;
