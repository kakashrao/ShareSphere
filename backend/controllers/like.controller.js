import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const likeDislikePost = asyncHandler(async (req, res) => {
  if (!req.params?.postId) {
    res.status(400).json(new ApiError(400, "Post Id parameter is missing."));
    return;
  }

  const foundLike = await Like.exists({
    postId: req.params.postId,
    userId: req.user.userId,
  });

  const value = req.query?.value
    ? req.query.value === "true"
      ? true
      : false
    : false;

  if (value && !!foundLike) {
    res
      .status(200)
      .json(new ApiResponse(200, {}, "You already liked the post."));
    return;
  } else if (!value && !foundLike) {
    res
      .status(200)
      .json(new ApiResponse(200, {}, "You haven't liked the post yet."));
    return;
  }

  if (value) {
    const like = new Like({
      postId: req.params.postId,
      userId: req.user.userId,
    });

    await like.save();

    const post = await Post.findOne({ _id: req.params.postId });
    post.likes++;

    await post.save();
  } else {
    const like = await Like.deleteOne({
      $and: [{ postId: req.params.postId }, { userId: req.user.userId }],
    });

    if (like["deletedCount"] === 0) {
      res.status(404).json(new ApiError(404, "Invalid User or Post."));
      return;
    }

    const post = await Post.findOne({ _id: req.params.postId });
    post.likes--;

    if (post.likes >= 0) {
      await post.save();
    }
  }

  res.status(200).json(new ApiResponse(200, {}, "Updated Successfully."));
});
