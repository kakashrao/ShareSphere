import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentOn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default Comment = mongoose.model("Comment", commentSchema);
