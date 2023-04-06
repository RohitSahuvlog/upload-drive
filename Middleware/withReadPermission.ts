import { NextFunction, Request, Response } from "express";
import { Permission } from "../db_helper/permission";
require("dotenv").config();

interface MyUserRequest extends Request {
  auth: string;
  userId: number;
}

const withReadpermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var Reqauth = req as MyUserRequest;
  try {
    var permissiondetails = await Permission.hasUserFileAccess(
      Reqauth.userId,
      req.params.id
    );
    if (permissiondetails) {
      return next();
    }
  } catch {
    res.status(500).send({ error: "err in withReadpermission" });
  }
};

export default withReadpermission;
