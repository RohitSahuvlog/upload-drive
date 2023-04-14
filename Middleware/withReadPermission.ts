import { NextFunction, Request, Response } from "express";
import { Permission } from "../db_helper/permission";

interface MyUserRequest extends Request {
  auth: string;
  userId: number;
}

const withReadPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ReqAuth = req as MyUserRequest;
  try {
    const hasPermission = await Permission.hasUserFileReadAccess(
      ReqAuth.userId,
      req.params.id
    );
    if (hasPermission) {
      return next();
    } else {
      return res.status(403).send({ message: "UnAuthorized" });
    }
  } catch {
    res.status(500).send({ message: "err in withReadpermission" });
  }
};

export default withReadPermission;
