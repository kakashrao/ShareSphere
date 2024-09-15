import Post from "../models/post.model.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

import mongoose from "mongoose";

// Create Post Method
export const createPost = asyncHandler(async (req, res) => {
  if (!req || !req.body) {
    throw new ApiError(400, "Invalid Request.");
  }

  if (req?.files?.media) {
    const result = [];

    for (const file of req.files.media) {
      try {
        const response = await uploadOnCloudinary(file.path, "posts");
        response?.url
          ? result.push({
              url: response?.url,
              format: response?.format,
              fileName: response?.original_filename,
            })
          : null;
      } catch (error) {}
    }

    req.body.media = [...result];
  }

  const post = new Post({ ...req.body, creator: req.user.userId });

  const savedPost = await post.save();
  if (savedPost) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          formatPost(savedPost),
          "Post Created Successfully."
        )
      );
  } else {
    throw new ApiError(500, "Failed to create post, please try again.");
  }
});

// Update post method
export const updatePost = asyncHandler(async (req, res) => {
  if (!req || !req.body) {
    throw new ApiError(400, "Invalid Request.");
  }

  if (!req.params?.postId) {
    throw new ApiError(400, "Post Id paramter is missing.");
  }

  if (req?.files?.media) {
    const result = [];

    for (const file of req.files.media) {
      try {
        const response = await uploadOnCloudinary(file.path, "posts");
        response?.url
          ? result.push({
              url: response?.url,
              format: response?.format,
              fileName: response?.original_filename,
            })
          : null;
      } catch (error) {}
    }

    req.body.media = [...result];
  }

  const post = await Post.findOne({
    $and: [{ _id: req.params.postId }, { creator: req.user.userId }],
  });

  if (!post) {
    throw new ApiError(400, "Could not find the post.");
  }

  post.title = req.body?.title ?? "";
  post.description = req.body?.description ?? "";
  post.media = req.body?.media ?? [];

  const updatedPost = await post.save();
  if (updatedPost) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          formatPost(updatedPost),
          "Post Updated Successfully."
        )
      );
  } else {
    throw new ApiError(500, "Failed to update post, please try again.");
  }
});

/** TODO - Send whether current user liked the post or not */
export const getAllPosts = asyncHandler(async (req, res) => {
  const page = req.query?.page ? req.query.page - 1 : 0;
  const size = req.query?.size ?? 10;

  if (page < 0) {
    throw new ApiError(400, "Page number should be gretaer than zero.");
  }

  const totalCount = await Post.estimatedDocumentCount({});

  if (page * size > totalCount) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { result: [], total: totalCount },
          "Posts Fetched Successfully."
        )
      );
    return;
  }

  const posts = await Post.aggregate([
    {
      $skip: +page * +size,
    },
    {
      $limit: +size,
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator",
        pipeline: [
          {
            $project: {
              fullName: 1,
              profileImage: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        creator: {
          $arrayElemAt: ["$creator", 0],
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "postId",
        as: "likesOnPost",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "commentOn",
        as: "commentsOnPost",
      },
    },
    {
      $addFields: {
        likes: {
          $size: "$likesOnPost",
        },
        comments: {
          $size: "$commentsOnPost",
        },
        isLiked: {
          $cond: {
            if: {
              $in: [
                req.user?.userId
                  ? new mongoose.Types.ObjectId(req.user?.userId)
                  : null,
                "$likesOnPost.userId",
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        media: 1,
        creator: 1,
        likes: 1,
        createdAt: 1,
        updatedAt: 1,
        comments: 1,
        isLiked: 1,
      },
    },
  ]);

  const data = {
    result: posts,
    total: totalCount,
  };

  res
    .status(200)
    .json(new ApiResponse(200, data, "Posts Fetched Successfully."));
});

/** TODO - Send whether current user liked the post or not */
export const getPostDetails = asyncHandler(async (req, res) => {
  if (!req.params?.postId) {
    res.status(400).json(new ApiError(400, "Invalid Request."));
    return;
  }

  const aggregatedPosts = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.postId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator",
        pipeline: [
          {
            $project: {
              fullName: 1,
              profileImage: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        creator: {
          $arrayElemAt: ["$creator", 0],
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "postId",
        as: "likesOnPost",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "commentOn",
        as: "commentsOnPost",
      },
    },
    {
      $addFields: {
        likes: {
          $size: "$likesOnPost",
        },
        comments: {
          $size: "$commentsOnPost",
        },
        isLiked: {
          $cond: {
            if: {
              $in: [
                req.user?.userId
                  ? new mongoose.Types.ObjectId(req.user?.userId)
                  : null,
                "$likesOnPost.userId",
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        media: 1,
        creator: 1,
        likes: 1,
        createdAt: 1,
        updatedAt: 1,
        comments: 1,
        isLiked: 1,
      },
    },
  ]);

  const post = aggregatedPosts?.[0];

  if (post) {
    res
      .status(200)
      .json(new ApiResponse(200, post, "Post Details Fetched Successfully."));
  } else {
    throw new ApiError(404, "Post not found.");
  }
});

/** TODO - Deleting the post should delete comments and likes as well related to post */
export const deletePost = asyncHandler(async (req, res) => {
  if (!req.params?.postId) {
    throw new ApiError(400, "Invalid Request.");
  }

  const post = await Post.deleteOne({
    $and: [{ _id: req.params.postId }, { creator: req.user.userId }],
  });

  if (post["deletedCount"] === 0) {
    res.status(404).json(new ApiError(404, "Could not find the post."));
    return;
  }

  res.status(200).json(new ApiResponse(200, {}, "Post Deleted Successfully."));
});

// Common functions below

const formatPost = (post) => {
  return {
    postId: post._id,
    title: post.title,
    description: post.description,
    media: post.media,
    creator: post.creator,
    likes: post?.likes ?? 0,
    comments: post?.comments ?? 0,
    isLiked: post?.isLiked ?? false,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};
