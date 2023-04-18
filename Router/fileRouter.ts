import { Router } from "express";
import multer from "multer";
import {
  uploadFile,
  deleteFile,
  updateUploadFile,
  getFileDetails,
  updateOwnership,
} from "../Controller/fileController";

import storage from "../Middleware/fileconfig";
import withOwnerPermission from "../Middleware/withOwnerPermission";
import withReadPermission from "../Middleware/withReadPermission";
import withWritePermission from "../Middleware/withWritePermission";

const fileRouter = Router();
const upload = multer({ storage: storage, limits: { fileSize: 1048576 } });
fileRouter.post("/details", withReadPermission, getFileDetails);
fileRouter.post("/upload", upload.array("file", 5), uploadFile);
fileRouter.post("/delete", withWritePermission, deleteFile);
fileRouter.post(
  "/update",
  withWritePermission,
  upload.array("file", 5),
  updateUploadFile
);
fileRouter.post("/transferowner", withOwnerPermission, updateOwnership);
export default fileRouter;
