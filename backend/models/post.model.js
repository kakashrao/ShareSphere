import mongoose from "mongoose";
import handleError from "../utils/errorHandler.js";

const thumbnailSchema = mongoose.Schema(
  {
    url: String,
    fileName: String,
    format: String,
  },
  { _id: false }
);

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    summary: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
      required: [true, "Cannot publish empty post."],
    },
    thumbnail: thumbnailSchema,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Invalid user."],
    },
  },
  { timestamps: true }
);

postSchema.post("save", (error, doc, next) => {
  if (error) {
    next(handleError(error));
  } else {
    next();
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
