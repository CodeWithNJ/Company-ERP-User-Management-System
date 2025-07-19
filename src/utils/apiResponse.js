export const apiResponse = (res, success, message, data, statusCode) => {
  return res.status(statusCode).json({ success, statusCode, message, data });
};
