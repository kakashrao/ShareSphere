import { ApiError } from "./apiError";

export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    const statusCode = error?.code || 500;
    const message = error?.message || "Something went wrong";

    res.send(statusCode).json(new ApiError(statusCode, message));
  }
};
