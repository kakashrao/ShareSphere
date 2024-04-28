import Comment from "../models/comment.model.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const addComment = asyncHandler(async (req, res) => {
  if (!req.body?.postId) {
    res.status(400).json(400, "Post Id parameter is missing.");
    return;
  }

  if (!req.body?.message) {
    res.status(400).json(400, "Message cannot be empty.");
    return;
  }

  const comment = new Comment({
    commentBy: req.user.userId,
    commentOn: req.body.postId,
    message: req.body.message,
  });

  const savedComment = await comment.save();

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
    res.status(400).json(400, "Comment Id parameter is missing.");
    return;
  }

  if (!req.body?.postId) {
    res.status(400).json(400, "Post Id parameter is missing.");
    return;
  }

  if (!req.body?.message) {
    res.status(400).json(400, "Message cannot be empty.");
    return;
  }

  const foundComment = await Comment.findOne({
    $and: [
      { _id: req.params.commentId },
      { commentBy: req.user.userId },
      { commentOn: req.body.postId },
    ],
  });

  if (!foundComment) {
    res.status(404).json(new ApiError(404, "Could not find the comment."));
    return;
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
    res.status(400).json(new ApiError(400, "Invalid Request."));
    return;
  }

  const comment = await Comment.deleteOne({
    $and: [
      { _id: req.params.commentId },
      { commentBy: req.user.userId },
      { commentOn: req.query.postId },
    ],
  });

  if (comment["deletedCount"] === 0) {
    res.status(404).json(new ApiError(404, "Could not find the comment."));
    return;
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
