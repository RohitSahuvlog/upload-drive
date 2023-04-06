import express, { Response, Request } from "express";
import fs from "fs";
import connection from "../Config/db";
import { Permission } from "../db_helper/permission";
interface uploadRequest extends Request {
  userId?: any;
  files: Array<any>;
}

export const postFile = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;
  try {
    await fs.stat(
      `./uploads/${uploadReq.files[0]["filename"]}`,
      async (err, fileStats) => {
        if (err) {
          console.log(err);
        } else {
          let size = fileStats.size;
          console.log(size);
          let sql = "INSERT INTO uploadinfo SET  ?";
          await connection.query(
            sql,
            {
              owner_id: uploadReq.userId,
              filepath: uploadReq.files[0]["filename"],
              filename: uploadReq.files[0]["originalname"],
              size,
            },
            (err: Error, result: any) => {
              if (err) {
                console.log(err);
              }
            }
          );
          let sql1 = "INSERT INTO permissions SET  ?";
          await connection.query(
            sql1,
            {
              uploadinfo_path: uploadReq.files[0]["filename"],
              user_id: uploadReq.userId,
              permission_type: 2,
            },
            (err: Error, result: any) => {
              if (err) {
                console.log(err);
              }
              return res.status(201).send({ message: "file uploads by owner" });
            }
          );
        }
      }
    );
  } catch (err) {
    res.status(500).send({ error: "file dont post" });
  }
};

export const getFile = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;

  try {
  var  ownerFile = await Permission.hasOwnerFile(uploadReq.userId)
        return res.status(200).send({ ownerFile });
    
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;
  const { filepaths } = req.body;
  try {
    let sql1 = `DELETE from permissions where  uploadinfo_path="${filepaths}"`;

    connection.query(sql1, async (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
    });

    await fs.unlinkSync(`./uploads/${filepaths}`);

    let sql = `DELETE from uploadinfo where  filepath="${filepaths}"`;

    connection.query(sql, async (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      return res.send({ message: "file  have deleted from database" });
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
      }
    );
    const formatedTimestamp = () => {
      const d = new Date();
      const date = d.toISOString().split("T")[0];
      const time = d.toTimeString().split(" ")[0];
      return `${date} ${time}`;
    };
    var date = await formatedTimestamp();
    let sql = `UPDATE uploadinfo SET update_at="${date}" WHERE filepath="${uploadReq.params.id}"`;
    await connection.query(sql, (err: Error, result: any) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ error: "file donot present in database" });
      }
      return res.status(201).send({ message: "file uploaded successfully" });
    });
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
  const { permissiontype, email } = req.body;

  try {
    connection.query(
      "SELECT * FROM user WHERE email =?",
      [email],
      async (err: Error, result: any) => {
        if (err) throw err;
        let accessuserid;
        if (result.length > 0) {
          accessuserid = result[0].id;
        }

        let sql2 = "INSERT INTO permissions SET  ?";
        connection.query(
          sql2,
          {
            user_id: accessuserid,
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
  } catch (error) {
    res.status(500).send({ error });
  }
};

export const getDetails = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;

  try {
    let sql1 = `SELECT DISTINCT user.id,uploadinfo.id,filepath,create_at,update_at,size,owner_id,
  user_id,filename,name,email from user join uploadinfo  on uploadinfo.owner_id=user.id 
   join permissions ON  permissions.uploadinfo_path =uploadinfo.filepath  `;

    await connection.query(sql1, async (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      return res.status(200).send({ result });
    });
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};

export const permissionsUpdate = (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest1;
  const { permissiontype, user_email } = req.body;

  try {
    connection.query(
      "SELECT * FROM user WHERE email =?",
      [user_email],(err: Error, result: any) => {
        if (err) throw err;
        let accessuserid;
        if (result.length > 0) {
          accessuserid = result[0].id;
        }

        let sql2 = `UPDATE INTO permissions SET where user_id=${accessuserid} ?`;
        connection.query(
          sql2,
          {
            user_id: accessuserid,
            uploadinfo_path: uploadReq.params.id,
            permission_type: permissiontype,
          },
          (err: Error, result: any) => {
            if (err) {
              console.log(err);
            }

            return res.send({
              message: "permission has been updated successfully",
            });
          }
        );
      }
    );
  } catch (error) {
   res.status(500).send({ error });
  }
};

export const deletePermissions = async (req: Request, res: Response) => {
  try {
    let sql1 = `DELETE from permissions where  uploadinfo_path="${req.params.id}"`;

    connection.query(sql1, async (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }

      if (result.length > 0) {
        return res.send({ message: "Permisssion  have deleted from database" });
      } else {
        return res.send({ message: "Owner donot give to access this file" });
      }
    });
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};
interface upload extends Request {
  filepaths?: any;
  user_id: Number;
}
export const specificPermissions = async (req: Request, res: Response) => {
  let uploadReq = req as upload;
  const { filepaths, user_id } = uploadReq.body;
  try {
    let sql1 = `DELETE from permissions where  user_id=${user_id}  AND uploadinfo_path="${filepaths}"`;

    connection.query(sql1, async (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      if (result.affectedRows > 0) {
        return res.send({ message: "Permission removed to given user" });
      } else {
        return res.send({ message: "Owner donot give to access this file" });
      }
    });
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};
