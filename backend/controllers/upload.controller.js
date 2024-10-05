import { Status } from "../constants/auth.constants.js";
import { BadRequest } from "../utils/apiError.utils.js";
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
      .status(Status.Created)
      .json(
        new ApiResponse(Status.Created, result, "Files uploaded successfully.")
      );
  } else {
    throw new BadRequest("Please select a file.");
  }
});

export const deleteMedia = asyncHandler(async (req, res) => {
  if (
    !req.body ||
    !req.body?.files ||
    !Array.isArray(req.body.files) ||
    !req.body.files.length
  ) {
    throw new BadRequest("Please provide the file(s).");
  }

  const filesToDelete = req.body.files; // files contains the filenames list
  const folderName = req.params.folder;

  for (const file of filesToDelete) {
    try {
      await deleteFromCloudinary(folderName, file);
    } catch (error) {}
  }

  res
    .status(Status.Ok)
    .json(new ApiResponse(Status.Ok, {}, "Successfully Deleted."));
});
