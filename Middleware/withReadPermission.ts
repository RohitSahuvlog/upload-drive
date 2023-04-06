import { NextFunction, Request, Response } from "express";
import { Permission } from "../db_helper/permission";
require("dotenv").config();

interface MyUserRequest extends Request {
  auth: string;
  userId: number;
}

const withReadpermission = async (
  req: MyUserRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  try {
    var permissiondetails = await Permission.getUserByfilepath(
      userId,
      req.params.id
    );
    if (permissiondetails.length > 0) {
      return next();
    }
  } catch {
    res.status(500).send({ error: "err in withReadpermission" });
  }
};

export default withReadpermission;
