import { Request, Response, NextFunction } from "express";
import { UploadRequest } from "../Config/uploadRequest";
import { Activities } from "../db_helper/activityFile";

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
  var urlPath = [stringCutted.at(1), stringCutted.at(2)].join("/");
  var filepath = req.originalUrl.substring(
    req.originalUrl.lastIndexOf("/") + 1
  );
  var urlDetails = getUrlDetails(`/${urlPath}`);
  try {
    await Activities.addActivity(
      urlDetails.activity,
      uploadReq.userId,
      ip,
      useragent,
      filepath,
      urlDetails.status
    );
    next();
  } catch (error) {
    await Activities.addActivity(
      urlDetails.activity,
      uploadReq.userId ? uploadReq.userId : 0,
      ip,
      useragent,
      filepath,
      `Error: ${error}`
    );

    return next(error);
  }
};

function getUrlDetails(url: String) {
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
    case `/permission/update`:
      obj = {
        activity: "UPDATE_PERMISSION",
        status: "SUCCESSFUL",
      };
      break;

    default:
      obj = {
        activity: "Url donot Found",
        status: "FAILURE",
      };
  }
  return obj;
}
