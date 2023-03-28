import express, { Response, Request } from "express";
import connection from "../Config/db";
import fs from "fs";
interface uploadRequest extends Request {
  userId?: any;
  files: Array<any>;
}

export const postFile = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;
  console.log(uploadReq.files[0]);
  try {
    await fs.stat(
      `./uploads/${uploadReq.files[0]["filename"]}`,
      (err, fileStats) => {
        if (err) {
          console.log(err);
        } else {
          let size = fileStats.size;
          console.log(size);
          let sql = "INSERT INTO uploadinfo SET  ?";
          connection.query(
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
              console.log(result);
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

// it give list of upload file by user
export const getFile = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;

  try {
    let sql = `SELECT * from uploadinfo where owner_id=${uploadReq.userId} `;
    await connection.query(sql, (err: Error, result1: any) => {
      if (err) {
        console.log(err);
      }

      let sql1 = `SELECT permissions.permission_id,uploadinfo.id,uploadinfo_path,user_id,filename from permissions join uploadinfo  on permissions.uploadinfo_path=uploadinfo.filepath where user_id=${uploadReq.userId}`;
      connection.query(sql1, (err: Error, result2: any) => {
        if (err) {
          console.log(err);
        }

        return res.status(200).send({ Files: result1, IndirectFile: result2 });
      });
    });
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    let sql1 = `SELECT permissions.permission_id,uploadinfo.id,uploadinfo_path,user_id,filepath from permissions join uploadinfo  on permissions.uploadinfo_path=uploadinfo.filepath where  filepath="${req.params.id}"`;

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

      let sql = `DELETE from uploadinfo where  filepath="${req.params.id}"`;

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

    // return res.send({ message: "file  have updated by awner or accessuser" });
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
};

export const getDetails = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;

  try {
    let sql1 = `SELECT user.id,uploadinfo.id,uploadfile,create_at,update_at,size,owner_id,
  acessuser_id,filename,name,email from user join uploadinfo  on uploadinfo.owner_id=user.id 
   join permissions
  ON  permissions.uploadinfo_path =uploadinfo.uploadfile ;`;

    await connection.query(sql1, async (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
      let sql = `SELECT user.id,uploadinfo.id,uploadfile,create_at,update_at,size,owner_id,
  filename,name,email from user join uploadinfo  on uploadinfo.owner_id=user.id`;
      await connection.query(sql, async (err: Error, result1: any) => {
        if (err) {
          console.log(err);
        }
        return res.status(200).send([...result1, ...result]);
      });
    });
  } catch {
    res.status(500).send({ error: "file donot present in database" });
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
  userId?: any;
specificuserId:Number
}
export const specificPermissions = async (req: Request, res: Response) => {
let uploadReq = req as upload;
  try {
    let sql1 = `DELETE from permissions where  user_id=${uploadReq.body.specificuserId}  AND uploadinfo_path="${uploadReq.params.id}"`;

    connection.query(sql1, async (err: Error, result: any) => {
      if (err) {
        console.log(err);
      }
console.log(result)
      if (result.affectedRows > 0) {
        return res.send({ message: "this user remove from permission" });
      } else {
        return res.send({ message: "Owner donot give to access this file" });
      }
    });
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};