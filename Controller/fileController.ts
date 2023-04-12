import express, { Response, Request } from "express";
import fs from "fs";
import connection from "../Config/db";
import { File } from "../db_helper/file";
import { Permission } from "../db_helper/permission";
import { User } from "../db_helper/user";
interface uploadRequest extends Request {
  userId?: any;
  files: Array<any>;
  id: Number;
}

export const postFile = async (req: Request, res: Response) => {
  
    const uploadReq = req as uploadRequest;
    const userId = uploadReq.userId;
    const fileName = uploadReq.files[0]["filename"];
    const originalName = uploadReq.files[0]["originalname"];
    const filePath = `./uploads/${fileName}`;
  try {
     const fileStats = fs.statSync(filePath);
     const size = fileStats.size;
     const [addUpload, addPermision] = await Promise.all([
       File.addUpload(userId, fileName, originalName, size),
       Permission.addPermision(fileName, userId, 2),
     ]);
       return res.status(201).send({ message: "file uploaded successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).send({ error: "Error uploading file" });
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

export const addPermisions = async (req: Request, res: Response) => {
  const uploadReq = req as uploadRequest;
  const { permissiontype, email } = req.body;
  const filepath = uploadReq.params.id;

  try {
    if (!permissiontype || !email) {
      res.status(400);
      throw new Error("Please Enter all the Feilds");
    }
    const userDetails: any = await User.getUserByEmail(email);
    if (!userDetails || !userDetails.length) {
      return res.status(404).send({ error: "User not found" });
    }
    const userid = userDetails[0].id;
    const addpermission = await Permission.addPermision(
      filepath,
      userid,
      permissiontype
    );
    return res.status(201).send({ message: "you have an access of this file" });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

export const getDetails = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;

  try {
    const result: Array<any> = await File.getFileDetails(uploadReq.params.id);
     var accessUser = await User.getAccessListUser(uploadReq.params.id);
      var array = {...result[0], accessUser};
      return res.status(200).send(array);
  } catch (err) {
    res.status(500).send({ error: "file donot present in database" });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;
  const { permissiontype, email } = req.body;
  let filepath = uploadReq.params.id;
  try {
    if (!permissiontype || !email) {
      res.status(400);
      throw new Error("Please Enter all the Feilds");
    }
    let userDetails: any = await User.getUserByEmail(email);
    if (!userDetails || !userDetails.length) {
      return res.status(404).send({ error: "User not found" });
    }
    const userid = userDetails[0].id;
    let addpermission: any = await Permission.addPermision(
      filepath,
      userid,
      permissiontype
    );

    return res.send({ message: "permission has been updated successfully" });
  } catch (error) {
    return res.status(500).send({ error });
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
