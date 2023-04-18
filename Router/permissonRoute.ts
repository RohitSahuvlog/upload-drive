import { Router } from "express";
import {
  addPermisions,
  removePermissions,
  updatePermission,
} from "../Controller/permissionController";
import withWritePermission from "../Middleware/withWritePermission";

const permissionRouter = Router();
permissionRouter.post("/add", withWritePermission, addPermisions);
permissionRouter.post("/remove", withWritePermission, removePermissions);
permissionRouter.post("/update", withWritePermission, updatePermission);

export default permissionRouter;
