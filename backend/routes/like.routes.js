import express from "express";
import { likeDislikePost } from "../controllers/like.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/update/:postId").put(checkAuth, likeDislikePost);

export default router;
