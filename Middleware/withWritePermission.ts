import { NextFunction, Request, Response } from "express";
import { Permission } from "../db_helper/permission";
require("dotenv").config();

interface MyUserRequest extends Request {
  auth: string;
  userId: number;
}

const withWritePermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ReqAuth = req as MyUserRequest;
  try {
    const hasPermission = await Permission.hasUserFileUpdateAccess(
      ReqAuth.userId,
      req.params.id
    );
    if (hasPermission) {
      return next();
    } else {
      return res.status(403).send({ error: "UnAuthorized" });
    }
  } catch {
    res.status(500).send({ error: "err in withWritepermission" });
  }
};

export default withWritePermission;
