import { Router } from "express";
import {
specificPermissions,
} from "../Controller/fileController";
import { addPermisions, deletePermissions, updatePermission } from "../Controller/permissionController";
import withWritePermission from "../Middleware/withWritePermission";

const permissionRouter = Router();
permissionRouter.post("/add/:id", withWritePermission, addPermisions);
permissionRouter.post(
  "/remove",
  withWritePermission,
  specificPermissions
);

permissionRouter.post(
  "/update/:id",
  withWritePermission,
  updatePermission
);


export default permissionRouter;
