import { NextFunction, Request, Response } from "express";
import { Permission } from "../db_helper/permission";

require("dotenv").config();

const withReadpermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var permissiondetails = await Permission.getUserByfilepath(req.params.id);
    if (permissiondetails.length > 0) {
      return next();
    }
  } catch {
    res.status(500).send({ error: "err in withReadpermission" });
  }
};

export default withReadpermission;
