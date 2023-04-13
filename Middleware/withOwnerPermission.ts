import { NextFunction, Request, Response } from "express";
import { Permission } from "../db_helper/permission";

interface MyUserRequest extends Request {
  auth: string;
  userId: number;
}

const withOwnerPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var ReqAuth = req as MyUserRequest;
  try {
    var hasPermission = await Permission.hasOwnerFileAccess(
      ReqAuth.userId,
      ReqAuth.params.id
    );
    if (hasPermission) {
      return next();
    } else {
      return res.status(403).send({ error: "UnAuthorized" });
    }
  } catch {
    res.status(500).send({ error: "err in withOwnerPermission" });
  }
};

export default withOwnerPermission;
