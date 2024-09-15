import multer from "multer";

import moment from "moment";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const fileNameSplit = file.originalname?.split(".");
    const fileName = `${fileNameSplit?.[0]?.substring(0, 15)}_${moment().format("YYYY_MM_DD_HH_mm")}.${fileNameSplit?.[fileNameSplit.length - 1]}`;
    cb(null, fileName);
  },
});

export const upload = multer({
  storage,
});
