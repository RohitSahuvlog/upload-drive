import { NextFunction, Request, Response } from "express";
import connection from "../Config/db";
require("dotenv").config();
interface MyUserRequest extends Request {
  userId?: string;
}

export const checkupload = (
  req: MyUserRequest,
  res: Response,
  next: NextFunction
) => {
  var imagepath = req.path;
  var t = imagepath.split("/")[1];
  console.log(t);
  try {
    let sql = `SELECT * from uploadinfo where owner_id=${req.userId} AND filepath="${t}"`;

    connection.query(sql, (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      if (result.length > 0) {
        next();
      } else {
        let sql1 = `SELECT permissions.permission_id,uploadinfo.id,uploadinfo_path,user_id,filepath from permissions join uploadinfo  on permissions.uploadinfo_path=uploadinfo.filepath where user_id=${req.userId} AND filepath="${t}" `;
        connection.query(sql1, (err: Error, result: any) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            next();
          } else {
            return res.send({ message: "you are not authorize to acess data" });
          }
        });
      }
    });
  } catch {
    res.status(500).send({ error: "err in uploadauthentication" });
  }
};
