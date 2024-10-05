import mongoose from "mongoose";

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
      required: true,
    },
    summary: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
      required: true,
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

const Post = mongoose.model("Post", postSchema);

export default Post;
