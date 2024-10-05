import { SecurityConst } from "../constants.js";
import { Unauthorized } from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { verifySecurityToken } from "../utils/security.utils.js";

export const checkAuth = asyncHandler(async (req, res, next) => {
  if (
    req.cookies[SecurityConst.csrfTokenServer] !==
    req.headers[SecurityConst.csrfTokenClient]
  ) {
    res
      .status(Status.Unauthorized)
      .json(new Unauthorized("Authorization Failed"));
    return;
  }

  const accessToken = req.cookies[SecurityConst.sessionId];

  if (!accessToken) {
    return res
      .status(Status.Unauthorized)
      .json(new Unauthorized("Authorization Failed"));
  }

  const decodedToken = verifySecurityToken(accessToken);

  if (decodedToken) {
    const user = {
      userId: decodedToken?.userId,
      email: decodedToken?.email,
    };

    req.user = { ...user };
    next();
  } else {
    return res
      .status(Status.Unauthorized)
      .json(new Unauthorized("Authorization Failed"));
  }
});

export const decodeTokenIfLogin = async (req, res, next) => {
  const accessToken = req.cookies[SecurityConst.sessionId];

  if (accessToken) {
    try {
      const decodedToken = verifySecurityToken(accessToken);

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
