import ApiError from "../utils/apiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { verifyJWT } from "../utils/security.utils.js";

const validateJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.send(401).json(new ApiError(401, "Authorization Failed"));
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
    res.send(401).json(new ApiError(401, "Authorization Failed"));
  }
});
