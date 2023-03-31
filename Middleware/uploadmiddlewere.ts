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
    let sql1 = `SELECT permissions.permission_id,uploadinfo.id,uploadinfo_path,user_id,filepath 
    from permissions join uploadinfo on permissions.uploadinfo_path=uploadinfo.filepath 
    where user_id=${req.userId}  AND filepath="${req.params.id}"`;

    await connection.query(sql1, (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      if (!err && result.length > 0) {
        return next();
      }
    });
  } catch {
    res.status(500).send({ error: "err in uploadauthentication" });
  }
};

export default uploadauthentication;
