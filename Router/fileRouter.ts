import { Router } from "express";
import {
  postFile,
  getFile,
  deleteFile,
  replaceFile,
  permissionsFunc,
  getDetails,
  deletePermissions,
  specificPermissions,
} from "../Controller/fileController";
import multer from "multer";

import storage from "../Middleware/fileconfig";
import uploadauthentication from "../Middleware/uploadmiddlewere";

const router = Router();
const fileFilter = (req: any, file: any, cb: any) => {
 
    cb(null, true);
 
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
router.get("/user/myfiles", getFile);
router.get("/details", getDetails);
router.post("/upload", upload.array("file", 5), postFile);
router.post("/permission/add/:id", uploadauthentication, permissionsFunc);
router.post(
  "/permission/remove",uploadauthentication,
  specificPermissions
);
router.delete("/permissiondelete/:id", uploadauthentication, deletePermissions);

router.post("/delete", uploadauthentication, deleteFile);
router.patch(
  "/update/:id",
  uploadauthentication,
  upload.array("file", 5),
  replaceFile
);

export default router;
