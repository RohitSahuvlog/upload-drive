import express, { Response, Request } from "express";
import connection from "../Config/db";
import fs from "fs";
interface uploadRequest extends Request {
  userId?: any;
  files: Array<any>;
}
export const postImage = (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;
console.log(uploadReq.files[0]);
  let sql = "INSERT INTO uploadinfo SET  ?";
  connection.query(
    sql,
    { user_id: uploadReq.userId, uploadfile: uploadReq.files[0]["filename"] },
    (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      return res.status(201).send({ message: "file uploads" });
    }
  );
};
export const getImage = (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;

  try {
    let sql = `SELECT * from uploadinfo where user_id=${uploadReq.userId}`;

    connection.query(sql, (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }

      return res.send(result);
    });
  } catch {
    res.status(500).send("file not present");
  }
};

export const deleteImage = (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;

  try {
    let sql = `DELETE from uploadinfo where user_id=${uploadReq.userId} and uploadfile="${req.params.id}"`;

    connection.query(sql, (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }

      return res.send("file delete");
    });
  } catch {
    res.status(500).send("file not present");
  }
};
export const replaceImage = (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;

  try {
    let sql = `UPDATE  uploadinfo SET uploadfile="${uploadReq.files[0]["filename"]}"  where user_id=${uploadReq.userId} and uploadfile="${req.params.id}"`;

    connection.query(sql, async (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      console.log(result, "t");
      if (result) {
        var t = await fs.unlinkSync(`./uploads/${req.params.id}`);
      }

      return res.send("file update");
    });
  } catch {
    res.status(500).send("file not present");
  }
};
