import mongoose, { MongooseError } from "mongoose";

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
    mediaFiles: [String],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Invalid user."],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.post("save", (error, doc, next) => {
  if (error instanceof MongooseError) {
    if (error?.errors) {
      for (const key in error.errors) {
        next(new ApiError(400, error.errors[key].message));
        break;
      }
    } else {
      next(new ApiError(500, "Something went wrong, while saving post."));
    }
  } else {
    next();
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
