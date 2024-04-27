import fs from "fs";

import { v2 as cloudinary } from "cloudinary";
import ApiError from "./apiError.utils.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCLoudinary = async (
  localFilePath,
  folder,
  allowedFormats = []
) => {
  try {
    if (!localFilePath) return null;

    const options = {
      folder: `share-sphere/${folder}`,
      use_filename: true,
      resource_type: "auto",
    };

    if (allowedFormats.length > 0) {
      options = {
        ...options,
        allowedFormats: allowedFormats,
      };
    }

    const response = await cloudinary.uploader.upload(localFilePath, options);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (file) => {
  try {
    const response = await cloudinary.uploader.destroy(file, {
      invalidate: true,
    });

    if (response["result"] === "ok") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new ApiError(500, "Could not delete the file.");
  }
};

export { deleteFromCloudinary, uploadOnCLoudinary };
