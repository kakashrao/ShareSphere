import express from "express";

const router = express.Router();

import commentRoutes from "./comment.routes.js";
import likeRoutes from "./like.routes.js";
import postRoutes from "./post.routes.js";
import uploadRoutes from "./upload.routes.js";
import userRoutes from "./user.routes.js";

router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/comment", commentRoutes);
router.use("/like", likeRoutes);
router.use("/assets", uploadRoutes);

export default router;
