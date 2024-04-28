import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const addComment = asyncHandler(async (req, res) => {
  if (!req.body?.postId) {
    throw new ApiError(400, "Post Id parameter is missing.");
  }

  if (!req.body?.message?.trim()) {
    throw new ApiError(400, "Message cannot be empty.");
  }

  const comment = new Comment({
    commentBy: req.user.userId,
    commentOn: req.body.postId,
    message: req.body.message,
  });

  const savedComment = await comment.save();

  const post = await Post.findOne({ _id: req.body.postId });
  post.comments++;

  await post.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        formatComment(savedComment),
        "Comment Saved Sucessfully."
      )
    );
});

export const updateComment = asyncHandler(async (req, res) => {
  if (!req.params?.commentId) {
    throw new ApiError(400, "Comment Id parameter is missing.");
  }

  if (!req.body?.postId) {
    throw new ApiError(400, "Post Id parameter is missing.");
  }

  if (!req.body?.message?.trim()) {
    throw new ApiError(400, "Message cannot be empty.");
  }

  const foundComment = await Comment.findOne({
    $and: [
      { _id: req.params.commentId },
      { commentBy: req.user.userId },
      { commentOn: req.body.postId },
    ],
  });

  if (!foundComment) {
    throw new ApiError(404, "Could not find the comment.");
  }

  foundComment.message = req.body.message;

  await foundComment.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        formatComment(foundComment),
        "Comment Saved Sucessfully."
      )
    );
});

export const deleteComment = asyncHandler(async (req, res) => {
  if (!req.query?.postId) {
    throw new ApiError(400, "Bad Request.");
  }

  const comment = await Comment.deleteOne({
    $and: [
      { _id: req.params.commentId },
      { commentBy: req.user.userId },
      { commentOn: req.query.postId },
    ],
  });

  if (comment["deletedCount"] === 0) {
    throw new ApiError(404, "Could not find the comment.");
  }

  const post = await Post.findOne({ _id: req.query.postId });
  post.comments--;

  if (post.comments >= 0) {
    await post.save();
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment Deleted Successfully."));
});

// Common methods below

const formatComment = (comment) => ({
  id: comment._id,
  message: comment.message,
  user: comment.commentBy,
});
