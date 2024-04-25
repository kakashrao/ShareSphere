import User from "../models/user.model.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { uploadOnCLoudinary } from "../utils/cloudinary.utils.js";
import { createJWT } from "../utils/security.utils.js";

export const registerUser = asyncHandler(async (req, res) => {
  if (!req || !req.body) {
    res.status(400).json(new ApiError(400, "Bad Request"));
    return;
  }

  const user = new User(req.body);

  if (req?.files?.profileImage?.[0]?.path) {
    const profileImage = await uploadOnCLoudinary(
      req.files.profileImage[0].path,
      "users"
    );

    user.profileImage = profileImage?.url ?? "";
  }

  if (req?.files?.coverImage?.[0]?.path) {
    const coverImage = await uploadOnCLoudinary(
      req.files.coverImage[0].path,
      "users"
    );

    user.coverImage = coverImage?.url ?? "";
  }

  try {
    const createdUser = await user.save();
    const token = await createJWT(createdUser._id, createdUser.email);

    const data = {
      ...formatUser(createdUser),
      token,
    };

    res
      .status(200)
      .json(new ApiResponse(200, data, "Successfully registered."));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      res.status(500).json(new ApiError(500, "Something went wrong"));
    }
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  if (!req || !req.body) {
    res.status(400).json(new ApiError(400, "Bad Request"));
    return;
  }

  if (!req.body?.id) {
    res
      .status(400)
      .json(new ApiError(400, "Please provide email or username."));
    return;
  }

  if (!req.body?.password) {
    res.status(400).json(new ApiError(400, "Please provide a valid password."));
    return;
  }

  const user = await User.findOne({
    $or: [{ username: req.body?.id }, { email: req.body?.id }],
  });

  if (user) {
    const isPasswordCorrect = await user.isPasswordCorrect(req.body.password);

    if (isPasswordCorrect) {
      const token = await createJWT(user._id, user.email);

      const data = {
        ...formatUser(user),
        token,
      };

      res
        .status(200)
        .json(new ApiResponse(200, data, "Successfully Logged In."));
    } else {
      res.status(401).json(new ApiError(401, "Invalid credentials."));
    }
  } else {
    res
      .status(404)
      .json(new ApiError(404, "Account not found, please register yourself."));
  }
});

export const getUserDetails = asyncHandler(async (req, res) => {
  if (!req?.user || !req?.user?.userId) {
    res.status(403).json(new ApiError(403, "Authorization Failed."));
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
      res.status(404).json(new ApiError(404, "User not found."));
    }
    return;
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(400, error?.message ?? "Failed to fetch user details.")
      );
    return;
  }
});

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
