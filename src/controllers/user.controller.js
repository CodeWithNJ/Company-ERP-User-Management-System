import { apiResponse } from "../utils/apiResponse.js";
import { PrismaClient } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGeneration.js";

const prisma = new PrismaClient({
  omit: {
    users: {
      password: true,
      refresh_token: true,
    },
  },
});

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
  } else {
    // TBD: Code for non admin user login.
  }
};

export const getUserProfile = async (req, res) => {
  // Profile details fetched using the access token in header.
  // Line 28 in auth.middleware.js
  const profileDetails = await prisma.users.findUnique({
    where: {
      user_id: req?.user?.user_id,
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
