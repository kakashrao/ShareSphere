import mongoose, { MongooseError } from "mongoose";

import argon2 from "argon2";
import ApiError from "../utils/apiError.utils.js";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: [true, "username should be unique."],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    profileImage: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (error) {
    next(new ApiError(500, "Something went wrong, please try again."));
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await argon2.verify(this.password, password);
};

userSchema.post("save", (error, doc, next) => {
  if (error.name === "MongoServerError" && error.code === 11000) {
    if (error.keyValue["username"]) {
      next(new ApiError(400, "User name already exists."));
    } else if (error.keyValue["email"]) {
      next(new ApiError(400, "Email already exists"));
    }
  } else if (error instanceof MongooseError) {
    if (error?.errors) {
      for (const key in error.errors) {
        next(new ApiError(400, error.errors[key].message));
        break;
      }
    }
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

export default User;
