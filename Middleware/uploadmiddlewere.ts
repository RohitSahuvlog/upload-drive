import { NextFunction, Request, Response } from "express";
import connection from "../Config/db";
require("dotenv").config();
interface MyUserRequest extends Request {
  userId?: string;
}

const uploadauthentication = async (
  req: MyUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.userId, req.params.id);
    let sql1 = `SELECT permissions.permission_id,uploadinfo.id,uploadinfo_path,acessuser_id,uploadfile from permissions join uploadinfo  on permissions.uploadinfo_path=uploadinfo.uploadfile where acessuser_id=${req.userId}  AND uploadfile="${req.params.id}"`;
    let sql2 = `SELECT * from uploadinfo where owner_id=${req.userId} AND uploadfile='${req.params.id}'`;
    let t1 = false;
    let t2 = false;
    await connection.query(sql1, (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        t1 = true;
      }
    });
    await connection.query(sql2, (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        t2 = true;
      }
    });
    setTimeout(() => {
      console.log("t1:", t1, "t2:", t2);
      if (t1 || t2) {
        next();
      } else {
        return res.send({ message: "you are not authorize to acess data" });
      }
    }, 1000);
  } catch {
    res.status(500).send({ error: "err in uploadauthentication" });
  }
};

export default uploadauthentication;
