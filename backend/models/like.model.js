import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Like = mongoose.model("Like", likeSchema);

export default Like;
