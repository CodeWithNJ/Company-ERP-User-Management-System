import { apiResponse } from "../utils/apiResponse.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllUserRoles = async (req, res) => {
  const allUserRoles = await prisma.roles.findMany();
  apiResponse(
    res,
    true,
    "All user roles fetched successfully",
    allUserRoles,
    200
  );
  return;
};
