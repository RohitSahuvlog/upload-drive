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
    { owner_id: uploadReq.userId, uploadfile: uploadReq.files[0]["filename"] },
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
    let sql = `SELECT * from uploadinfo where owner_id=${uploadReq.userId} `;

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
    let sql = `DELETE from uploadinfo where owner_id=${uploadReq.userId} and uploadfile="${req.params.id}"`;

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
      (err: any) => {
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

interface uploadRequest1 extends Request {
  userId?: any;
  files: Array<any>;
}

export const permissionsfunc = (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest1;
  const { permissiontype, accessemail, uploadid } = req.body;

  // fetch the accessuserid base on email

  connection.query(
    "SELECT * FROM user WHERE email =?",
    [accessemail],
    async (err: Error, result: any) => {
      if (err) throw err;
      console.log(result);
      let accessuserid;
      if (result) {
        accessuserid = result[0].id;
      }
      let sql2 = "INSERT INTO permissions SET  ?";
      connection.query(
        sql2,
        {
          acessuser_id: accessuserid,
          uploadinfo_id: uploadid,
          permission_type: permissiontype,
        },
        (err: Error, result: any) => {
          if (err) {
            console.log(err);
          }
          return res.status(201).send({ message: " you are access this file" });
        }
      );
    }
  );
};

