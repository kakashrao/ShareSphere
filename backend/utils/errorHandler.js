import mongoose, { MongooseError } from "mongoose";
import { ApiError } from "./apiError.utils.js";

const handleError = (error) => {
  if (error instanceof MongooseError) {
    if (error instanceof mongoose.Error.ValidationError) {
      return new ApiError(400, "Invalid Request.");
    } else if (error?.errors) {
      for (const key in error.errors) {
        return new ApiError(400, error.errors[key].message);
      }
    } else {
      return new ApiError(500, error?.message ?? "Something went wrong.");
    }
  } else {
    return new ApiError(500, error?.message ?? "Something went wrong.");
  }
};

export default handleError;
