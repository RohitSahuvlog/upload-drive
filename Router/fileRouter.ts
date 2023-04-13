import { Router } from "express";
import multer from "multer";
import {
  uploadFile,
  deleteFile,
  updateUploadFile,
  getFileDetails,
} from "../Controller/fileController";

import storage from "../Middleware/fileconfig";
import withReadPermission from "../Middleware/withReadPermission";
import withWritePermission from "../Middleware/withWritePermission";

const fileRouter = Router();

const upload = multer({ storage: storage });

fileRouter.get("/details/:id", withReadPermission, getFileDetails);
fileRouter.post("/upload", upload.array("file", 5), uploadFile);
fileRouter.post("/delete/:id", withWritePermission, deleteFile);
fileRouter.post(
  "/update/:id",
  withWritePermission,
  upload.array("file", 5),
  updateUploadFile
);

export default fileRouter;
