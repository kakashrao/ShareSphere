import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.utils.js";

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else if (error instanceof jwt.TokenExpiredError) {
      res
        .status(401)
        .json(new ApiError(401, "Session expired, please login again."));
    } else {
      const statusCode = error?.code || 500;
      const message = error?.message || "Something went wrong";

      res.status(statusCode).json(new ApiError(statusCode, message));
    }
  }
};

export default asyncHandler;
