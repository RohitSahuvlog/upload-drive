import { Router } from "express";
import {
deletePermissions,
specificPermissions,
} from "../Controller/fileController";
import { addPermisions, updatePermission } from "../Controller/permissionController";
import withWritePermission from "../Middleware/withWritePermission";

const permissionRouter = Router();
permissionRouter.post("/add/:id", withWritePermission, addPermisions);
permissionRouter.post(
  "/remove",
  withWritePermission,
  specificPermissions
);
permissionRouter.delete(
  "/delete/:id",
  withWritePermission,
  deletePermissions
);
permissionRouter.post(
  "/update/:id",
  withWritePermission,
  updatePermission
);


export default permissionRouter;
