import mongoose from "mongoose";

const postImageSchema = mongoose.Schema({
  url: String,
  fileName: String,
});

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [postImageSchema],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default Post = mongoose.model("Post", postSchema);
