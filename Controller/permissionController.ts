import { Response, Request } from "express";
import { UploadRequest } from "../Config/uploadRequest";
import { Permission } from "../db_helper/permission";
import { User } from "../db_helper/user";

export const addPermisions = async (req: Request, res: Response) => {
  const uploadReq = req as UploadRequest;
  const { permissiontype, email } = req.body;
  const filepath = uploadReq.params.id;

  try {
    if (!filepath || !permissiontype || !email) {
      return res.status(400).send({ message: "Please Enter all the Feilds" });
    }
    const userDetails: any = await User.getUserByEmail(email);
    if (!userDetails || !userDetails.length) {
      return res.status(404).send({ error: "User not found" });
    }
    const userid = userDetails[0].id;
    const addpermission = await Permission.addPermision(
      filepath,
      userid,
      permissiontype
    );
    return res.status(201).send({ message: "you have an access of this file" });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  let uploadReq = req as UploadRequest;
  const { permissiontype, email } = req.body;
  let filepath = uploadReq.params.id;
  try {
    if (!filepath || !permissiontype || !email) {
      return res.status(400).send({ message: "Please Enter all the Feilds" });
    }
    if (permissiontype != 1 && permissiontype != 2) {
      return res
        .status(400)
        .send({ message: "Please Enter valid permission type" });
    }

    let userDetails: any = await User.getUserByEmail(email);
    if (!userDetails || !userDetails.length) {
      return res.status(404).send({ error: "User not found" });
    }

    const userid = userDetails[0].id;
    let addpermission: any = await Permission.updatePermission(
      filepath,
      userid,
      permissiontype
    );

    if (addpermission[1] === 0) {
      return res.status(404).send({ error: "User have not authorized" });
    }

    return res.send({ message: "permission has been updated successfully" });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

export const deletePermissions = async (req: Request, res: Response) => {
  let uploadReq = req as UploadRequest;
  let filepath = uploadReq.params.id;

  try {
    let deleteDetails: any = await Permission.deletePermission(filepath);
    console.log(deleteDetails);
    if (deleteDetails.length > 0) {
      return res.send({ message: "Permisssion  have deleted from database" });
    } else {
      return res.send({ message: "Owner donot give to access this file" });
    }
  } catch {
    res.status(500).send({ error: "file donot present in database" });
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

    let deletePermission: any = await Permission.deleteSpecificPermission(
      userid,
      filepath
    );

    return res.send({ message: "Permission removed from given user" });
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};
