import { ImageFormats, SecurityConst } from "../constants.js";
import {
  accessibleCookieOptions,
  secureCookieOptions,
  Status,
} from "../constants/auth.constants.js";
import User from "../models/user.model.js";
import {
  BadRequest,
  NotFound,
  ServerError,
  Unauthorized,
} from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import {
  createCsrfToken,
  generateSecurityTokens,
} from "../utils/security.utils.js";
import { signUpSchema } from "../validators/schema/auth.schema.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { error } = signUpSchema.validate(req.body);

  if (!!error) {
    throw new BadRequest(error.message);
  }

  const user = new User(req.body);

  const createdUser = await user.save();

  const { accessToken, refreshToken } = await generateSecurityTokens(
    createdUser._id,
    createdUser.email
  );
  const csrfToken = await createCsrfToken();

  createdUser.refershToken = refreshToken;
  await createdUser.save();

  const data = {
    ...formatUser(createdUser),
  };

  res
    .cookie(SecurityConst.sessionId, accessToken, secureCookieOptions)
    .cookie(SecurityConst.refreshId, refreshToken, secureCookieOptions)
    .cookie(SecurityConst.csrfTokenServer, csrfToken, accessibleCookieOptions)
    .json(new ApiResponse(Status.Ok, data, "Successfully registered."));
});

export const loginUser = asyncHandler(async (req, res) => {
  if (!req.body || !req.body?.id || !req.body?.password) {
    throw new BadRequest();
  }

  const user = await User.findOne({
    $or: [{ username: req.body.id }, { email: req.body.id }],
  });

  if (!!user) {
    const isPasswordCorrect = await user.isPasswordCorrect(req.body.password);

    if (isPasswordCorrect) {
      const { accessToken, refreshToken } = await generateSecurityTokens(
        user._id,
        user.email
      );
      const csrfToken = await createCsrfToken();

      user.refreshToken = refreshToken;
      await user.save();

      const data = {
        ...formatUser(user),
      };

      res
        .cookie(SecurityConst.sessionId, accessToken, secureCookieOptions)
        .cookie(SecurityConst.refreshId, refreshToken, secureCookieOptions)
        .cookie(
          SecurityConst.csrfTokenServer,
          csrfToken,
          accessibleCookieOptions
        )
        .json(new ApiResponse(Status.Ok, data, "Successfully Logged In."));
    } else {
      throw new Unauthorized("username or password is invalid.");
    }
  } else {
    throw new NotFound("Account not found, please register yourself.");
  }
});

export const getUserDetails = asyncHandler(async (req, res) => {
  if (!req?.user || !req?.user?.userId) {
    return res
      .status(Status.NoContent)
      .json(new ApiResponse(Status.NoContent, null, "Not found."));
  }

  try {
    const user = await User.findOne({ _id: req.user.userId });

    if (user) {
      const data = {
        ...formatUser(user),
      };

      res
        .status(Status.Ok)
        .json(new ApiResponse(Status.Ok, data, "Successfully fetched."));
    } else {
      throw new NotFound("User not found.");
    }
    return;
  } catch (error) {
    throw new ServerError();
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res
    .status(Status.Ok)
    .clearCookie(SecurityConst.sessionId)
    .clearCookie(SecurityConst.refreshId)
    .clearCookie(SecurityConst.csrfTokenServer)
    .json(new ApiResponse(200, data, "Successfully Logged Out."));
});

/** Not yet implemented */
export const updateUser = async (req) => {
  if (req?.files?.profileImage?.[0]?.path) {
    const profileImage = await uploadOnCloudinary(
      req.files.profileImage[0].path,
      "users",
      req?.files?.profileImage?.[0]?.mimetype === "image/jpeg"
        ? []
        : ImageFormats
    );

    user.profileImage = profileImage?.url ?? "";
  }

  if (req?.files?.coverImage?.[0]?.path) {
    const coverImage = await uploadOnCloudinary(
      req.files.coverImage[0].path,
      "users",
      req?.files?.profileImage?.[0]?.mimetype === "image/jpeg"
        ? []
        : ImageFormats
    );

    user.coverImage = coverImage?.url ?? "";
  }
};

/* Common methods below */

const formatUser = (user) => {
  return {
    userId: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage ?? "",
    coverImage: user.coverImage ?? "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
