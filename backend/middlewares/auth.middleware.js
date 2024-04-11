import ApiError from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { verifySessionToken } from "../utils/security.utils.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.send(401).json(new ApiError(401, "Authorization Failed"));
    return;
  }

  const decodedToken = verifySessionToken(token);

  if (decodedToken) {
    const user = {
      userId: decodedToken?.id,
      email: decodedToken?.email,
    };

    req.user = { ...user };
    next();
  } else {
    res.send(401).json(new ApiError(401, "Authorization Failed"));
  }
});
