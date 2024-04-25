import express from "express";
import {
  getUserDetails,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";

import { checkAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/register").post(
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").put(loginUser);

router.route("/me").get(checkAuth, getUserDetails);

export default router;
