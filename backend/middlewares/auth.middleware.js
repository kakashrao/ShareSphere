import ApiError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { verifyJWT } from "../utils/security.utils.js";

export const checkAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers?.authorization;

  if (!token) {
    res.status(401).json(new ApiError(401, "Authorization Failed"));
    return;
  }

  const decodedToken = verifyJWT(token);

  if (decodedToken) {
    const user = {
      userId: decodedToken?.userId,
      email: decodedToken?.email,
    };

    req.user = { ...user };
    next();
  } else {
    res.status(401).json(new ApiError(401, "Authorization Failed"));
    return;
  }
});
