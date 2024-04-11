import multer from "multer";

import moment from "moment";
import { dateFormat } from "../constants.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const fileNameSplit = file.originalname?.split(".");
    const fileName = `${fileNameSplit?.[0]}_${moment().format(dateFormat)}.${fileNameSplit?.[1]}`;
    cb(null, fileName);
  },
});

export const upload = multer({
  storage,
});
