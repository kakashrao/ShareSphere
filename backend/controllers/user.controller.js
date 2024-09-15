import { ImageFormats, SecurityConst } from "../constants.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { createCsrfToken, createJWT } from "../utils/security.utils.js";

export const registerUser = asyncHandler(async (req, res) => {
  if (!req || !req.body) {
    throw new ApiError(400, "Bad Request.");
  }

  const registeredUser = {
    fullName: req.body?.name,
    username: req.body?.username,
    email: req.body?.email,
    password: req?.body?.password,
  };

  const user = new User(registeredUser);

  const createdUser = await user.save();
  const accessToken = await createJWT(createdUser._id, createdUser.email);
  const csrfToken = await createCsrfToken();

  const data = {
    ...formatUser(createdUser),
  };

  const cookieOptions = process.env.COOKIE_OPTIONS;

  res.status(200).cookie(SecurityConst.sessionId, accessToken, cookieOptions);
  res
    .cookie(SecurityConst.csrfTokenServer, csrfToken, {
      ...cookieOptions,
      http: false,
    })
    .json(new ApiResponse(200, data, "Successfully registered."));
});

export const loginUser = asyncHandler(async (req, res) => {
  if (!req || !req.body) {
    throw new ApiError(400, "Bad Request.");
  }

  if (!req.body?.id) {
    throw new ApiError(400, "Please provide email or username.");
  }

  if (!req.body?.password) {
    throw new ApiError(400, "Please provide a valid password.");
  }

  const user = await User.findOne({
    $or: [{ username: req.body?.id }, { email: req.body?.id }],
  });

  if (user) {
    const isPasswordCorrect = await user.isPasswordCorrect(req.body.password);

    if (isPasswordCorrect) {
      const accessToken = await createJWT(user._id, user.email);
      const csrfToken = await createCsrfToken();

      const data = {
        ...formatUser(user),
      };

      const cookieOptions = process.env.COOKIE_OPTIONS;

      res
        .status(200)
        .cookie(SecurityConst.sessionId, accessToken, cookieOptions)
        .cookie(SecurityConst.csrfTokenServer, csrfToken, {
          ...cookieOptions,
          http: false,
        })
        .json(new ApiResponse(200, data, "Successfully Logged In."));
    } else {
      throw new ApiError(401, "username or password is invalid.");
    }
  } else {
    throw new ApiError(404, "Account not found, please register yourself.");
  }
});

export const getUserDetails = asyncHandler(async (req, res) => {
  if (!req?.user || !req?.user?.userId) {
    res.status(204).json();
    return;
  }

  try {
    const user = await User.findOne({ _id: req.user.userId });

    if (user) {
      const data = {
        ...formatUser(user),
      };

      res.status(200).json(new ApiResponse(200, data, "Successfully fetched."));
    } else {
      throw new ApiError(404, "User not found.");
    }
    return;
  } catch (error) {
    throw new ApiError(500, "Failed to fetch user details.");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie(SecurityConst.sessionId)
    .clearCookie(SecurityConst.csrfTokenServer)
    .json(new ApiResponse(200, data, "Successfully Logged Out."));
});

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
