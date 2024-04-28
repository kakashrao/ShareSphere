import express from "express";
import {
  addComment,
  deleteComment,
  updateComment,
} from "../controllers/comment.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/add").post(checkAuth, addComment);

router.route("/update/:commentId").put(checkAuth, updateComment);

router.route("/:commentId").delete(checkAuth, deleteComment);

export default router;
