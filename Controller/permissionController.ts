import { Response, Request } from "express";
import { UploadRequest } from "../Config/uploadRequest";
import { File } from "../db_helper/file";
import { Permission } from "../db_helper/permission";
import { User } from "../db_helper/user";

export const addPermisions = async (req: Request, res: Response) => {
  const uploadReq = req as UploadRequest;
  const { permissionType, email } = req.body;
  const filepath = uploadReq.params.id;

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
      return res.status(404).send({ error: "User not found" });
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
  let filepath = uploadReq.params.id;
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
      return res.status(404).send({ error: "User not found" });
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
      return res.status(404).send({ error: "User have not authorized" });
    }

    return res.send({ message: "permission has been updated successfully" });
  } catch (error) {
    return res.status(500).send({ error });
  }
};


export const removePermissions = async (req: Request, res: Response) => {
  let uploadReq = req as UploadRequest;
  const { user_email } = uploadReq.body;
  let filepath = uploadReq.params.id;

  try {
    const userDetails: any = await User.getUserByEmail(user_email);
    if (!userDetails || !userDetails.length) {
      return res.status(404).send({ error: "User not found" });
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
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};
