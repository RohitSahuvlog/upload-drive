import { NextFunction, Request, Response } from "express";
import { Permission } from "../db_helper/permission";

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
  const { filepath } = ReqAuth.body;
  console.log(filepath);
  try {
    const hasPermission = await Permission.hasUserFileUpdateAccess(
      ReqAuth.userId,
      filepath
    );
    if (hasPermission) {
      return next();
    } else {
      return res.status(403).send({ message: "UnAuthorized" });
    }
  } catch {
    res.status(500).send({ message: "err in withWritePermission" });
  }
};

export default withWritePermission;
