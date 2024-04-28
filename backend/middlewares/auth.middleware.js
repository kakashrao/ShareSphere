import { SecurityConst } from "../constants.js";
import ApiError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { verifyJWT } from "../utils/security.utils.js";

export const checkAuth = asyncHandler(async (req, res, next) => {
  if (
    req.cookies[SecurityConst.csrfTokenServer] !==
    req.headers[SecurityConst.csrfTokenClient]
  ) {
    res.status(401).json(new ApiError(401, "Authorization Failed"));
    return;
  }

  const accessToken = req.cookies[SecurityConst.sessionId];

  if (!accessToken) {
    res.status(401).json(new ApiError(401, "Authorization Failed"));
    return;
  }

  const decodedToken = verifyJWT(accessToken);

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

export const decodeTokenIfLogin = async (req, res, next) => {
  const accessToken = req.cookies[SecurityConst.sessionId];

  if (accessToken) {
    try {
      const decodedToken = verifyJWT(accessToken);

      if (decodedToken) {
        const user = {
          userId: decodedToken?.userId,
          email: decodedToken?.email,
        };

        req.user = { ...user };
      }
    } catch (error) {}
  }

  next();
};
