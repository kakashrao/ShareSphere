import express from "express";
import {
  getUserDetails,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";

import {
  checkAuth,
  decodeTokenIfLogin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").put(loginUser);
router.route("/logout").put(checkAuth, logoutUser);
router.route("/refreshToken").put(refreshAccessToken);

router.route("/me").get(decodeTokenIfLogin, getUserDetails);

// router.route("/update/user").put(
//   upload.fields([
//     { name: "profileImage", maxCount: 1 },
//     { name: "coverImage", maxCount: 1 },
//   ])
// );

export default router;
