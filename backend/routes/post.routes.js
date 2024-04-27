import express from "express";
import { createPost, updatePost } from "../controllers/post.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/create").post(checkAuth, upload.array("media"), createPost);

router.route("/update").post(checkAuth, updatePost);

export default router;
