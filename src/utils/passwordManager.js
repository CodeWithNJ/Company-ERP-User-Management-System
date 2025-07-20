import bcrypt from "bcryptjs";

export const hashPassword = async (plainTextPassword) => {
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
  return hashedPassword;
};

export const checkIsPasswordCorrect = async (
  plainTextPassword,
  hashedPassword
) => {
  const isPasswordCorrect = await bcrypt.compare(
    plainTextPassword,
    hashedPassword
  );
  return isPasswordCorrect;
};
