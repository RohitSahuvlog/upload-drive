import { Router } from "express";
import {
  addPermisions,
  removePermissions,
  updatePermission,
} from "../Controller/permissionController";
import withWritePermission from "../Middleware/withWritePermission";

const permissionRouter = Router();
permissionRouter.post("/add/:id", withWritePermission, addPermisions);
permissionRouter.post("/remove/:id", withWritePermission, removePermissions);
permissionRouter.post("/update/:id", withWritePermission, updatePermission);

export default permissionRouter;
