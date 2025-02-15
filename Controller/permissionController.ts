import { Response, Request } from "express";
import { UploadRequest } from "../Config/uploadRequest";
import { Permission } from "../db_helper/permission";
import { User } from "../db_helper/user";

export const addPermisions = async (req: Request, res: Response) => {
  const uploadReq = req as UploadRequest;
  const { permissionType, email } = req.body;
  const { filepath } = uploadReq.body;

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

    return res.status(201).send({ message: "you have an access of this file" });
  } catch (error) {
   
    return res.status(500).send({ error });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  let uploadReq = req as UploadRequest;
  const { permissionType, email } = req.body;
  const { filepath } = uploadReq.body;
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
   
    return res.send({ message: "permission has been updated successfully" });
  } catch (error) {
   
    return res.status(500).send({ error });
  }
};

export const removePermissions = async (req: Request, res: Response) => {
  let uploadReq = req as UploadRequest;
  const { email } = uploadReq.body;
  const { filepath } = uploadReq.body;
  let ip: any =
    (uploadReq.headers["x-forwarded-for"] as string)?.split(",")[1] ||
    uploadReq.connection.remoteAddress;
  let useragent = uploadReq.headers["user-agent"] as string;
  try {
    const userDetails: any = await User.getUserByEmail(email);
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

    return res.send({ message: "Permission removed from given user" });
  } catch (error) {
   
    res.status(500).send({ message: "file donot present in database" });
  }
};
