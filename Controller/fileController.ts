import { Response, Request } from "express";
import fs from "fs";
import { UploadRequest } from "../Config/uploadRequest";
import { File } from "../db_helper/file";
import { Permission } from "../db_helper/permission";
import { User } from "../db_helper/user";

export const uploadFile = async (req: Request, res: Response) => {
  const uploadReq = req as UploadRequest;
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
    res.status(500).send({ error: "Error uploading file" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  let uploadReq = req as UploadRequest;
  let filepath = uploadReq.params.id;
  let routeFile = `./uploads/${filepath}`;

  try {
    await fs.unlinkSync(routeFile);
    let deletePermission: any = await Permission.deletePermission(filepath);
    let deleteFile: any = await File.deleteFile(filepath);

    return res.send({ message: "file has been deleted" });
  } catch (error) {
    return res.status(500).send({ error: "file donot present in database" });
  }
};

// export const replaceFile = async (req: Request, res: Response) => {
//   let uploadReq = req as UploadRequest;

//   try {
//     fs.rename(
//       "./uploads/" + uploadReq.files[0]["filename"],
//       "./uploads/" + req.params.id,
//       (err: any) => {
//         if (err) throw err;
//       }
//     );
//     const formatedTimestamp = () => {
//       const d = new Date();
//       const date = d.toISOString().split("T")[0];
//       const time = d.toTimeString().split(" ")[0];
//       return `${date} ${time}`;
//     };
//     var date = await formatedTimestamp();
//     let sql = `UPDATE uploadinfo SET update_at="${date}" WHERE filepath="${uploadReq.params.id}"`;
//     await connection.query(sql, (err: Error, result: any) => {
//       if (err) {
//         console.log(err);
//         return res
//           .status(500)
//           .send({ error: "file donot present in database" });
//       }
//       return res.status(201).send({ message: "file uploaded successfully" });
//     });
//   } catch {
//     res.status(500).send({ error: "file donot present in database" });
//   }
// };

export const getDetails = async (req: Request, res: Response) => {
  let uploadReq = req as UploadRequest;
  let filepath = uploadReq.params.id;

  try {
    const result: Array<any> = await File.getFileDetails(filepath);
    var accessUser = await User.getAccessListUser(filepath);
    var array = { ...result[0], accessUser };
    return res.status(200).send(array);
  } catch (err) {
    res.status(500).send({ error: "file donot present in database" });
  }
};
