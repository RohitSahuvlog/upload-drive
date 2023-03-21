import { NextFunction, Request, Response } from "express";
import connection from "../Config/db";
require("dotenv").config();
interface MyUserRequest extends Request {
  userId?: string;
}

const uploadauthentication = (
  req: MyUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql = `SELECT * from uploadinfo where user_id=${req.userId} AND uploadfile="${req.params.id}"`;

    connection.query(sql, (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      if (result.length > 0) {
        next();
      } else {
        return res.send({ message: "you are not authorize to acess data" });
      }
    });
  } catch {
    res.status(500).send("err in uploadauthentication");
  }
};

export default uploadauthentication;
