import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllUserRoles } from "../controllers/roles.controller.js";

const rolesRouter = Router();

rolesRouter.route("/").get(verifyJWT, getAllUserRoles);

export default rolesRouter;
