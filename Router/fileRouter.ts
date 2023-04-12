import { Router } from "express";
import multer from "multer";
import {
  postFile,
  deleteFile,
  replaceFile,
  getDetails
} from "../Controller/fileController";


import storage from "../Middleware/fileconfig";
import uploadauthentication from "../Middleware/uploadmiddlewere";
import withReadPermission from "../Middleware/withReadPermission";
import withWritePermission from "../Middleware/withWritePermission";

const fileRouter = Router();
const fileFilter = (req: any, file: any, cb: any) => {
  cb(null, true);
};


const upload = multer({ storage: storage, fileFilter: fileFilter });

fileRouter.get("/details/:id",withReadPermission, getDetails);
fileRouter.post("/upload", upload.array("file", 5), postFile);
fileRouter.post("/delete/:id",withWritePermission, deleteFile);
fileRouter.post(
  "/update/:id",
  uploadauthentication,
  upload.array("file", 5),
  replaceFile
);

export default fileRouter;
