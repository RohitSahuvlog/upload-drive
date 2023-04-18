import { NextFunction, Request, Response } from "express";
import { Permission } from "../db_helper/permission";

interface MyUserRequest extends Request {
  auth: string;
  userId: number;
}

const withOwnerdownload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ReqAuth = req as MyUserRequest;
  var filepath = req.originalUrl.substring(
    req.originalUrl.lastIndexOf("/") + 1
  );
  console.log(ReqAuth.userId, filepath);
  try {
    const hasPermission = await Permission.hasUserFileReadAccess(
      ReqAuth.userId,
      filepath
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

export default withOwnerdownload;
