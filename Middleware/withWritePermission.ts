import { NextFunction, Request, Response } from "express";
import { Permission } from "../db_helper/permission";
require("dotenv").config();

interface MyUserRequest extends Request {
  auth: string;
  userId: number;
}

const withWritepermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var Reqauth = req as MyUserRequest;
  try {
    var permissiondetails = await Permission.hasUserFileUpdateAccess(
      Reqauth.userId,
      req.params.id
    );
    if (permissiondetails) {
      return next();
    } else {
      return res.status(403).send({ error: " you havenot Authorized for update the file" });
    }
  } catch {
    res.status(500).send({ error: "err in withWritepermission" });
  }
};

export default withWritepermission;
