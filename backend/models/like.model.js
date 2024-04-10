import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

export default Like = mongoose.model("Like", likeSchema);
