import ApiError from "./apiError.utils.js";

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      const statusCode = error?.code || 500;
      const message = error?.message || "Something went wrong";

      res.status(statusCode).json(new ApiError(statusCode, message));
    }
  }
};

export default asyncHandler;
