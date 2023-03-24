import express, { Response, Request } from "express";
import connection from "../Config/db";
import fs from "fs";
interface uploadRequest extends Request {
  userId?: any;
  files: Array<any>;
}
export const postFile = (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;
  let sql = "INSERT INTO uploadinfo SET  ?";
  connection.query(
    sql,
    { owner_id: uploadReq.userId, uploadfile: uploadReq.files[0]["filename"] },
    (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      return res.status(201).send({ message: "file uploads by owner" });
    }
  );
};
export const getFile = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;

  try {
    let sql = `SELECT * from uploadinfo where owner_id=${uploadReq.userId} `;
    await connection.query(sql, (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      if (result.length == 0) {
        let sql1 = `SELECT permissions.permission_id,uploadinfo.id,uploadinfo_path,acessuser_id,uploadfile from permissions join uploadinfo  on permissions.uploadinfo_path=uploadinfo.uploadfile where acessuser_id=${uploadReq.userId}`;
        connection.query(sql1, (err: Error, result: any) => {
          if (err) {
            console.log(err);
          }

          return res.status(200).send({ Files: result });
        });
      } else {
        return res.status(200).send({ Files: result });
      }
    });
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  console.log(req.params.id);

  try {
    let sql1 = `SELECT permissions.permission_id,uploadinfo.id,uploadinfo_path,acessuser_id,uploadfile from permissions join uploadinfo  on permissions.uploadinfo_path=uploadinfo.uploadfile where  uploadfile="${req.params.id}"`;

    connection.query(sql1, async (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
          let sql = `DELETE from permissions where  permission_id=${result[i].permission_id}`;

          connection.query(sql, async (err: Error, result: any) => {
            if (err) {
              console.log(err);
            }
          });
        }
      }
      await fs.unlinkSync(`./uploads/${req.params.id}`);

      let sql = `DELETE from uploadinfo where  uploadfile="${req.params.id}"`;

      connection.query(sql, async (err: Error, result: any) => {
        if (err) {
          console.log(err);
        }
        return res.send({ message: "file  have deleted from database" });
      });
    });
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};
export const replaceFile = async (req: Request, res: Response) => {
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

    return res.send({ message: "file  have updated by awner or accessuser" });
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};

interface uploadRequest1 extends Request {
  userId?: any;
  files: Array<any>;
}

export const permissionsFunc = (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest1;
  const { permissiontype, accessemail } = req.body;

  // fetch the accessuserid base on email
console.log(uploadReq.params.id);
  connection.query(
    "SELECT * FROM user WHERE email =?",
    [accessemail],
    async (err: Error, result: any) => {
      if (err) throw err;
      console.log(result);
      let accessuserid;
      if (result.length > 0) {
        accessuserid = result[0].id;
      }
      let sql2 = "INSERT INTO permissions SET  ?";
      connection.query(
        sql2,
        {
          acessuser_id: accessuserid,
          uploadinfo_path: uploadReq.params.id,
          permission_type: permissiontype,
        },
        (err: Error, result: any) => {
          if (err) {
            console.log(err);
          }
          return res
            .status(201)
            .send({ message: "you have an access of this file" });
        }
      );
    }
  );
};
