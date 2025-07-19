import jwt from "jsonwebtoken";
import { apiResponse } from "../utils/apiResponse.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifyJWT = async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    apiResponse(res, false, "Unauthorized user.", null, 401);
  }

  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  const validUser = await prisma.users.findUnique({
    where: {
      user_id: decodedToken?.user_id,
    },
  });

  if (!validUser) {
    apiResponse(res, false, "Invalid access token", null, 401);
  }

  req.user = validUser;
  next();
};
