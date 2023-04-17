import { Request, Response, NextFunction } from "express";
import { UploadRequest } from "../Config/uploadRequest";
import { User } from "../db_helper/user";

export const activityLoggerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uploadReq = req as UploadRequest;

  let ip: any =
    (uploadReq.headers["x-forwarded-for"] as string)?.split(",")[1] ||
    uploadReq.connection.remoteAddress;
  let useragent = uploadReq.headers["user-agent"] as string;
  let stringCutted = req.originalUrl.split("/");
  var t1 = [stringCutted.at(1), stringCutted.at(2)].join("/");
  var filepath = req.originalUrl.substring(
    req.originalUrl.lastIndexOf("/") + 1
  );
  var t = what(`/${t1}`);
  try {
    await User.addActivity(
      t.activity,
      uploadReq.userId,
      ip.split(":")[3],
      useragent,
      filepath,
      t.status
    );
    next();
  } catch (error) {
    await User.addActivity(
      t.activity,
      uploadReq.userId ? uploadReq.userId : 0,
      ip.split(":")[3],
      useragent,
      filepath,
      `Error: ${error}`
    );

    return next(error);
  }
};

function what(url: String) {
  var obj;
  switch (url) {
    case "/permission/add":
      obj = {
        activity: "ADD_PERMISSION",
        status: "SUCCESSFUL",
      };
      break;
    case `/permission/remove`:
      obj = {
        activity: "REMOVE_PERMISSION",
        status: "SUCCESSFUL",
      };
      break;

    default:
      obj = {
        activity: "UPDATE_PERMISSION",
        status: "SUCCESSFUL",
      };
  }
  return obj;
}
