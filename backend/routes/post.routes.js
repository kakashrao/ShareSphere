import express from "express";
import { createPost } from "../controllers/post.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/create").post(checkAuth, createPost);

export default router;
