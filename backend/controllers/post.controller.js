import Post from "../models/post.model.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { uploadOnCLoudinary } from "../utils/cloudinary.utils.js";

// Create Post Method
export const createPost = asyncHandler(async (req, res) => {
  if (!req || !req.body) {
    res.status(400).json(new ApiError(400, "Invalid Request."));
    return;
  }

  if (req?.files?.media) {
    const result = [];

    for (const file of req.files.media) {
      try {
        const response = await uploadOnCLoudinary(file.path, "posts");
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
    res
      .status(500)
      .json(new ApiError(500, "Failed to create post, please try again."));
  }
});

// Update post method
export const updatePost = asyncHandler(async (req, res) => {
  if (!req || !req.body) {
    res.status(400).json(new ApiError(400, "Invalid Request."));
    return;
  }

  if (!req.params?.postId) {
    res.status(400).json(new ApiError(400, "Post Id paramter is missing."));
    return;
  }

  if (req?.files?.media) {
    const result = [];

    for (const file of req.files.media) {
      try {
        const response = await uploadOnCLoudinary(file.path, "posts");
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
    res.status(404).json(new ApiError(404, "Could not find the post."));
    return;
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
    res
      .status(500)
      .json(new ApiError(500, "Failed to update post, please try again."));
  }
});

/** TODO - Send whether current user liked the post or not */
export const getAllPosts = asyncHandler(async (req, res) => {
  const page = req.query?.page ? req.query.page - 1 : 0;
  const size = req.query?.size ?? 10;

  if (page < 0) {
    res
      .status(400)
      .json(new ApiError(400, "Page number should be gretaer than zero."));
    return;
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

  const posts = await Post.find()
    .skip(page * size)
    .limit(size)
    .populate("creator", "fullName profileImage");

  const data = {
    result: posts.map((d) => formatPost(d)),
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

  const post = await Post.findById(req.params.postId).populate(
    "creator",
    "fullName profileImage"
  );

  if (post) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          formatPost(post),
          "Post Details Fetched Successfully."
        )
      );
  } else {
    res.status(404).json(new ApiError(404, "Post not found."));
  }
});

/** TODO - Deleting the post should delete comments and likes as well related to post */
export const deletePost = asyncHandler(async (req, res) => {
  if (!req.params?.postId) {
    res.status(400).json(new ApiError(400, "Invalid Request."));
    return;
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
    likes: post.likes,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};
