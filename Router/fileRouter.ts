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
router.get("/get", getFile);
router.get("/getdetails", getDetails);
router.post("/post", upload.array("file", 5), postFile);
router.post("/permission/:id", uploadauthentication, permissionsFunc);
router.delete(
  "/specificPer/:id",uploadauthentication,
  specificPermissions
);
router.delete("/permissiondelete/:id", uploadauthentication, deletePermissions);

router.delete("/delete/:id", uploadauthentication, deleteFile);
router.patch(
  "/update/:id",
  uploadauthentication,
  upload.array("file", 5),
  replaceFile
);
router.get("/getdetails", getDetails);

export default router;
