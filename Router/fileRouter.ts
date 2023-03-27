import { Router } from "express";
import {
  postFile,
  getFile,
  deleteFile,
  replaceFile,
  permissionsFunc,
} from "../Controller/fileController";
import multer from "multer";

import storage from "../Middleware/fileconfig";
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
router.get("/get", getFile);
router.post("/post", upload.array("file", 5), postFile);
router.post("/permission/:id", uploadauthentication, permissionsFunc);

router.delete("/delete/:id", uploadauthentication, deleteFile);
router.patch(
  "/update/:id",
  uploadauthentication,
  upload.array("file", 5),
  replaceFile
);
router.get("/getdetails", getDetails);

export default router;
