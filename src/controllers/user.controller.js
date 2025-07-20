import { apiResponse } from "../utils/apiResponse.js";
import { PrismaClient } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGeneration.js";
import {
  checkIsPasswordCorrect,
  hashPassword,
} from "../utils/passwordManager.js";

const prisma = new PrismaClient();

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  // Email or password input is missing.
  if (!email || !password) {
    apiResponse(res, false, "Required fields missing.", null, 400);
    return;
  }

  // Check whether user exists.
  const validUser = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  // User not found.
  if (!validUser) {
    apiResponse(res, false, "User not found.", null, 404);
    return;
  }

  // User exists, check the password.

  // Check password for user having admin role.
  if (validUser.role === "CA") {
    // Incorrect password for admin.
    if (password !== validUser.password) {
      apiResponse(res, false, "Incorrect password.", null, 400);
      return;
    }
  } else {
    const isPasswordCorrect = await checkIsPasswordCorrect(
      password,
      validUser.password
    );
    if (!isPasswordCorrect) {
      apiResponse(res, false, "Incorrect password", 400);
      return;
    }
  }

  // Successfull login. Generate access and refresh tokens for admin user.
  const accessToken = generateAccessToken(validUser);
  const refreshToken = generateRefreshToken(validUser);

  // Add refresh token in the database.
  await prisma.users.update({
    where: { email },
    data: {
      refresh_token: refreshToken,
    },
  });

  // Set secure cookies in response with options.
  const options = {
    httpOnly: true,
    secure: true,
  };

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  apiResponse(
    res,
    true,
    "User logged in successfully",
    { access_token: accessToken },
    200
  );
  return;
};

export const getUserProfile = async (req, res) => {
  // Profile details fetched using the access token in header.
  // Line 28 in auth.middleware.js
  const profileDetails = await prisma.users.findUnique({
    where: {
      user_id: req?.user?.user_id,
    },
    omit: {
      password: true,
      refresh_token: true,
    },
  });
  apiResponse(
    res,
    true,
    "User profile details fetched successfully.",
    profileDetails,
    200
  );
};

export const createNewUser = async (req, res) => {
  const userDetails = await prisma.users.findUnique({
    where: {
      user_id: req?.user.user_id,
    },
  });
  if (userDetails.role !== "CA") {
    apiResponse(
      res,
      false,
      "Non admin users not allowed to create users.",
      null,
      400
    );
    return;
  }
  const { full_name, email, password, role } = req.body;
  // Check whether user already exists for the provided email.
  const userExists = await prisma.users.findUnique({
    where: {
      email,
    },
  });
  if (userExists) {
    apiResponse(res, false, "User already exists.", null, 409);
    return;
  }
  const hashedPassword = await hashPassword(password);
  await prisma.users.create({
    data: {
      full_name,
      email,
      company_id: userDetails.company_id,
      password: hashedPassword,
      role,
      created_by: userDetails.user_id,
    },
  });
  apiResponse(res, true, "New user created successfully", null, 201);
  return;
};

export const getAllUsers = async (req, res) => {
  const userDetails = await prisma.users.findUnique({
    where: {
      user_id: req?.user.user_id,
    },
  });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Example: Using Prisma
  const users = await prisma.users.findMany({
    where: {
      company_id: userDetails.company_id,
    },
    skip: offset,
    take: limit,
    omit: {
      password: true,
      refresh_token: true,
    },
  });

  const totalUsers = await prisma.users.count({
    where: {
      company_id: userDetails.company_id,
    },
  });
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({
    success: true,
    message: "All users fetched successfully.",
    data: users,
    meta: {
      total_users: totalUsers,
      page,
      limit,
      totalPages,
    },
  });
};
