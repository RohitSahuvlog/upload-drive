import { Router } from "express";
import { postImage } from "../Controller/ImageController";
import multer from "multer";

import storage from "../Middleware/Imageconfig";

const router = Router();
const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    "image/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
router.post("/post", upload.array("file", 5), postImage);
export default router;
