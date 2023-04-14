import { Response, Request } from "express";
import { UploadRequest } from "../Config/uploadRequest";
import { File } from "../db_helper/file";
import { Permission } from "../db_helper/permission";
import { User } from "../db_helper/user";

export const addPermisions = async (req: Request, res: Response) => {
  const uploadReq = req as UploadRequest;
  const { permissionType, email } = req.body;
  const filepath = uploadReq.params.id;
  let ip: any =
    (uploadReq.headers["x-forwarded-for"] as string)?.split(",")[1] ||
    uploadReq.connection.remoteAddress;
  let useragent = uploadReq.headers["user-agent"] as string;
  try {
    if (!filepath || !permissionType || !email) {
      return res.status(400).send({ message: "Please Enter all the Feilds" });
    }
    if (permissionType != 1 && permissionType != 2) {
      return res
        .status(400)
        .send({ message: "Please Enter valid permission type" });
    }
    const userDetails: any = await User.getUserByEmail(email);
    if (!userDetails || !userDetails.length) {
      return res.status(404).send({ message: "User not found" });
    }
    const userid = userDetails[0].id;
    const addpermission = await Permission.addPermision(
      filepath,
      userid,
      permissionType
    );

    let activity = await Permission.addActivity(
      "ADD_PERMISSION",
      userid,
      ip.split(":")[3],
      useragent,
      filepath,
      `User ${userid} was granted permission ${permissionType} to access file ${filepath} by user ${uploadReq.userId}`
    );
    return res.status(201).send({ message: "you have an access of this file" });
  } catch (error) {
    await Permission.addActivity(
      "ERROR",
      0,
      ip.split(":")[3],
      useragent,
      filepath,
      `Error occurred while logging activity: ${error}`
    );
    return res.status(500).send({ error });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  let uploadReq = req as UploadRequest;
  const { permissionType, email } = req.body;
  let filepath = uploadReq.params.id;
  let ip: any =
    (uploadReq.headers["x-forwarded-for"] as string)?.split(",")[1] ||
    uploadReq.connection.remoteAddress;
  let useragent = uploadReq.headers["user-agent"] as string;
  try {
    if (!filepath || !permissionType || !email) {
      return res.status(400).send({ message: "Please Enter all the Feilds" });
    }
    if (permissionType != 1 && permissionType != 2) {
      return res
        .status(400)
        .send({ message: "Please Enter valid permission type" });
    }

    let userDetails: any = await User.getUserByEmail(email);
    if (!userDetails || !userDetails.length) {
      return res.status(404).send({ message: "User not found" });
    }

    const userid = userDetails[0].id;
    const hasOwner = await Permission.hasOwnerFileAccess(userid, filepath);
    if (hasOwner) {
      return res.send({ message: "You arenot owner of file" });
    }
    let addpermission: any = await Permission.updatePermission(
      filepath,
      userid,
      permissionType
    );

    if (addpermission[1] === 0) {
      return res.status(404).send({ message: "User have not authorized" });
    }
    let activity = await Permission.addActivity(
      "UPDATE_PERMISSION",
      userid,
      ip.split(":")[3],
      useragent,
      filepath,
      `User ${userid} was granted  update permission ${permissionType} to access file ${filepath} by user ${uploadReq.userId}`
    );
    return res.send({ message: "permission has been updated successfully" });
  } catch (error) {
    await Permission.addActivity(
      "ERROR",
      0,
      ip.split(":")[3],
      useragent,
      filepath,
      `Error occurred while logging activity: ${error}`
    );
    return res.status(500).send({ error });
  }
};

export const removePermissions = async (req: Request, res: Response) => {
  let uploadReq = req as UploadRequest;
  const { user_email } = uploadReq.body;
  let filepath = uploadReq.params.id;
  let ip: any =
    (uploadReq.headers["x-forwarded-for"] as string)?.split(",")[1] ||
    uploadReq.connection.remoteAddress;
  let useragent = uploadReq.headers["user-agent"] as string;
  try {
    const userDetails: any = await User.getUserByEmail(user_email);
    if (!userDetails || !userDetails.length) {
      return res.status(404).send({ message: "User not found" });
    }
    const userid = userDetails[0].id;
    const hasOwner = await Permission.hasOwnerFileAccess(userid, filepath);
    if (hasOwner) {
      return res.send({ message: "You arenot owner of file" });
    }
    let deletePermission: any = await Permission.deleteSpecificPermission(
      userid,
      filepath
    );
    let activity = await Permission.addActivity(
      "DELETE_PERMISSION",
      userid,
      ip.split(":")[3],
      useragent,
      filepath,
      `User ${userid} was granted  remove permission  to the file ${filepath} by user ${uploadReq.userId}`
    );

    return res.send({ message: "Permission removed from given user" });
  } catch (error) {
    await Permission.addActivity(
      "ERROR",
      0,
      ip.split(":")[3],
      useragent,
      filepath,
      `Error occurred while logging activity: ${error}`
    );
    res.status(500).send({ message: "file donot present in database" });
  }
};
