import express from "express";
import { deleteMedia, uploadMedia } from "../controllers/upload.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/upload/:folder")
  .post(checkAuth, upload.array("files"), uploadMedia);

router.route("/delete/:folder").put(checkAuth, deleteMedia);

export default router;
