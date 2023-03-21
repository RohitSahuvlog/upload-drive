import { Router } from "express";
import {
  postImage,
  getImage,
  deleteImage,
} from "../Controller/ImageController";
import multer from "multer";

import storage from "../Middleware/Imageconfig";
import uploadauthentication from "../Middleware/uploadmiddlewere";

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
router.get("/get", getImage);
router.delete("/delete/:id", uploadauthentication, deleteImage);
export default router;
