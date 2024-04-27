import Post from "../models/post.model.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const createPost = asyncHandler(async (req, res) => {
  if (!req || !req.body) {
    res.status(400).json(new ApiError(400, "Invalid Request."));
    return;
  }

  const post = new Post({ ...req.body, creator: req.user.userId });

  try {
    const savedPost = await post.save();
    if (savedPost) {
      res.status(200).json(new ApiResponse(200, "Post created successfully."));
    } else {
      res
        .status(500)
        .json(new ApiError(500, "Failed to create post, please try again."));
    }
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      res.status(500).json(new ApiError(500, "Something went wrong"));
    }
  }
});
