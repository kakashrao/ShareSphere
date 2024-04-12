import User from "../models/user.model.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { createJWT } from "../utils/security.utils.js";

export const registerUser = asyncHandler(async (req, res) => {
  const user = new User(req.body);

  try {
    const createdUser = await user.save();
    const token = await createJWT(createdUser._id, createdUser.email);

    const data = {
      userId: createdUser._id,
      fullName: createdUser.fullName,
      email: createdUser.email,
      profileImage: createdUser.profileImage,
      coverImage: createdUser.coverImage,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
      token,
    };

    res
      .status(200)
      .json(new ApiResponse(200, data, "Successfully registered."));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      console.log(error);
      res.status(500).json(new ApiError(500, "Something went wrong"));
    }
  }
});
