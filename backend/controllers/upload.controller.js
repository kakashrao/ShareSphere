import { ApiError } from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import {
  deleteFromCloudinary,
  uploadMultipleFilesToCloudinary,
} from "../utils/cloudinary.utils.js";

export const uploadMedia = asyncHandler(async (req, res) => {
  const files = req.files;
  const folder = req.params.folder;

  if (files && files.length > 0) {
    const result = await uploadMultipleFilesToCloudinary(files, folder);

    res
      .status(201)
      .json(new ApiResponse(201, result, "Files uploaded successfully."));
  } else {
    res.status(400).json(new ApiError(400, "Please select a file."));
  }
});

export const deleteMedia = asyncHandler(async (req, res) => {
  if (!req.body || !req.body?.files) {
    res.status(400).json(new ApiError(400, "Please provide the file(s)."));
    return;
  }

  if (!Array.isArray(req.body.files)) {
    res.status(400).json(new ApiError(400, "Invalid Request."));
    return;
  }

  if (!req.body.files.length) {
    res.status(400).json(new ApiError(400, "Please provide the file(s)."));
    return;
  }

  const filesToDelete = req.body.files; // files contains the filenames list
  const folderName = req.params.folder;

  for (const file of filesToDelete) {
    try {
      await deleteFromCloudinary(folderName, file);
    } catch (error) {}
  }

  res.status(200).json(new ApiResponse(200, {}, "Successfully Deleted."));
});
