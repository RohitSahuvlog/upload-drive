import { Request, Response, NextFunction } from "express";
import { UploadRequest } from "../Config/uploadRequest";
import { Activities } from "../db_helper/activityFile";

export const activityLoggerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uploadReq = req as UploadRequest;
  const { email } = uploadReq.body;
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
      uploadReq.userId ? uploadReq.userId : 0,
      ip,
      useragent,
      filepath,
      urlDetails.status,
      email || ""
    );
    next();
  } catch (error) {
    await Activities.addActivity(
      urlDetails.activity,
      uploadReq.userId ? uploadReq.userId : 0,
      ip,
      useragent,
      filepath,
      `Error: ${error}`,
      email
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
    case `/user/login`:
      obj = {
        activity: "LOGIN",
        status: "SUCCESSFUL",
      };
      break;
    case `/user/register`:
      obj = {
        activity: "REGISTER",
        status: "SUCCESSFUL",
      };
      break;
    case `/permission/update`:
      obj = {
        activity: "UPDATE_PERMISSION",
        status: "SUCCESSFUL",
      };
      break;
    case `/user/myfiles`:
      obj = {
        activity: "GET_MYDETAILS",
        status: "SUCCESSFUL",
      };
      break;
    case `/file/upload`:
      obj = {
        activity: "UPLOAD_FILE",
        status: "SUCCESSFUL",
      };
      break;
    case `/file/delete`:
      obj = {
        activity: "DELETE_FILE",
        status: "SUCCESSFUL",
      };
      break;
    case `/file/update`:
      obj = {
        activity: "UPDATE_FILE",
        status: "SUCCESSFUL",
      };
      break;
    case `/file/transferowner`:
      obj = {
        activity: "TRANSFER_OWNERSHIP",
        status: "SUCCESSFUL",
      };
      break;
    case `/file/details`:
      obj = {
        activity: "DETAILS",
        status: "SUCCESSFUL",
      };
      break;
    case `/uploads/1681798227789-download.jpeg`:
      obj = {
        activity: "DETAILS",
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
