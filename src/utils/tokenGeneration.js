import jwt from "jsonwebtoken";

export const generateAccessToken = (validUser) => {
  return jwt.sign(
    {
      user_id: validUser.user_id,
      full_name: validUser.full_name,
      email: validUser.email,
      role: validUser.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const generateRefreshToken = (validUser) => {
  return jwt.sign(
    {
      _id: validUser.user_id,
      email: validUser.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
