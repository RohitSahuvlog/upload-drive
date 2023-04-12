import express, { Response, Request } from "express";
import { Permission } from "../db_helper/permission";
import { User } from "../db_helper/user";

interface uploadRequest extends Request {
  userId?: any;
  files: Array<any>;
  id: Number;
}

export const addPermisions = async (req: Request, res: Response) => {
  const uploadReq = req as uploadRequest;
  const { permissiontype, email } = req.body;
  const filepath = uploadReq.params.id;

  try {
    if (!permissiontype || !email) {
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
  let uploadReq = req as uploadRequest;
  const { permissiontype, email } = req.body;
  let filepath = uploadReq.params.id;
  try {
    if (!permissiontype || !email) {
      return res.status(400).send({ message: "Please Enter all the Feilds" });
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

    return res.send({ message: "permission has been updated successfully" });
  } catch (error) {
    return res.status(500).send({ error });
  }
};
