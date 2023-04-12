import { Router } from "express";
import multer from "multer";
import {
  postFile,
  deleteFile,
  replaceFile,
  getDetails,
  deletePermissions,
  specificPermissions,
  permissionsUpdate,
  addPermisions,
} from "../Controller/fileController";


import storage from "../Middleware/fileconfig";
import uploadauthentication from "../Middleware/uploadmiddlewere";
import withOwnerPermission from "../Middleware/withOwnerPermission";
import withReadPermission from "../Middleware/withReadPermission";

const fileRouter = Router();
const fileFilter = (req: any, file: any, cb: any) => {
  cb(null, true);
};


const upload = multer({ storage: storage, fileFilter: fileFilter });

fileRouter.get("/details/:id",withReadPermission, getDetails);
fileRouter.post("/upload", upload.array("file", 5), postFile);
fileRouter.post("/permission/add/:id", withOwnerPermission, addPermisions);
fileRouter.post("/permission/remove", uploadauthentication, specificPermissions);
fileRouter.delete("/permissiondelete/:id", uploadauthentication, deletePermissions);
fileRouter.post("/permission/update/:id", uploadauthentication, permissionsUpdate);
fileRouter.post("/delete", uploadauthentication, deleteFile);
fileRouter.post(
  "/update/:id",
  uploadauthentication,
  upload.array("file", 5),
  replaceFile
);

export default fileRouter;
