import Like from "../models/like.model.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const togglePostLike = asyncHandler(async (req, res) => {
  if (!req.params?.postId) {
    throw new ApiError(400, "Post Id parameter is missing.");
  }

  const foundLike = await Like.exists({
    postId: req.params.postId,
    userId: req.user.userId,
  });

  if (!foundLike) {
    const like = new Like({
      postId: req.params.postId,
      userId: req.user.userId,
    });

    await like.save();
  } else {
    const like = await Like.deleteOne({
      $and: [{ postId: req.params.postId }, { userId: req.user.userId }],
    });

    if (like["deletedCount"] === 0) {
      throw new ApiError(404, "Invalid User or Post.");
    }
  }

  res.status(200).json(new ApiResponse(200, {}, "Updated Successfully."));
});
