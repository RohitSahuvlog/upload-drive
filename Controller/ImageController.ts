import express, { Response, Request } from "express";
import connection from "../Config/db";
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
    let sql = `SELECT * from uploadinfo where user_id=${uploadReq.userId} `;

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
export const replaceImage = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;

  try {
    fs.rename(
      "./uploads/" + uploadReq.files[0]["filename"],
      "./uploads/" + req.params.id,
      (err) => {
        if (err) throw err;
        console.log(
          "New image for user with id " + uploadReq.files[0]["filename"],
          req.params.id
        );
      }
    );

    return res.send("file update");
  } catch {
    res.status(500).send("file not present");
  }
};
