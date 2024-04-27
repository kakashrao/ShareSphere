import mongoose from "mongoose";

import argon2 from "argon2";
import ApiError from "../utils/apiError.utils.js";
import handleError from "../utils/errorHandler.js";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
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
  if (error?.name === "MongoServerError" && error?.code === 11000) {
    if (error.keyValue["username"]) {
      next(new ApiError(400, "User name already exists."));
    } else if (error.keyValue["email"]) {
      next(new ApiError(400, "Email already exists."));
    } else {
      next(new ApiError(500, "Something went wrong."));
    }
  } else if (error) {
    next(handleError(error));
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

export default User;
