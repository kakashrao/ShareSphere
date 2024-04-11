import asyncHandler from "../utils/asyncHandler.utils.js";

export const registerUser = asyncHandler(async (req, res) => {
  console.log(req.headers);
  console.log("files", req.files?.coverImage);
  console.log("body", req.body.message);
  res.send("Hii");
});
