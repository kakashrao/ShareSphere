import mongoose from "mongoose";
import handleError from "../utils/errorHandler.js";

const mediaSchema = mongoose.Schema(
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
    description: {
      type: String,
      default: "",
    },
    media: [mediaSchema],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Invalid user."],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
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
