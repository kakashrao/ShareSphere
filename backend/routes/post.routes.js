import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostDetails,
  updatePost,
} from "../controllers/post.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/create").post(checkAuth, upload.array("media"), createPost);

router
  .route("/update/:postId")
  .put(checkAuth, upload.array("media"), updatePost);

router.route("/all").get(getAllPosts);

router.route("/:postId").get(getPostDetails);

router.route("/:postId").delete(checkAuth, deletePost);

export default router;
