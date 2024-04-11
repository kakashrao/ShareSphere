import User from "../models/user.model.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const registerUser = asyncHandler(async (req, res) => {
  const user = new User(req.body);

  try {
    const createdUser = await user.save();
    res.status(200).json(new ApiResponse(200, "User created Successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      res.status(500).json(new ApiError(500, "Something went wrong"));
    }
  }
});
