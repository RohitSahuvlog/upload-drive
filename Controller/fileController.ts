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
    const totalsize: any = await File.fileSize(userId);
    const total = Number(totalsize[0].totalsize) + Number(size);
    if (total > Number(process.env.FILESIZE)) {
      return res.status(400).send({ message: "size limit exceed" });
    }
    const [addUpload, addPermision] = await Promise.all([
      File.addUpload(userId, fileName, originalName, size),
      Permission.addPermision(fileName, userId, 2),
    ]);
    return res.status(201).send({ message: "file uploaded successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error uploading file" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  let uploadReq = req as UploadRequest;
  const { filepath } = uploadReq.body;
  let routeFile = `./uploads/${filepath}`;

  try {
    await fs.unlinkSync(routeFile);
    let deletePermission: any = await Permission.deletePermission(filepath);
    let deleteFile: any = await File.deleteFile(filepath);

    return res.send({ message: "file has been deleted" });
  } catch (error) {
    return res.status(500).send({ message: "file donot present in database" });
  }
};

export const updateUploadFile = async (req: Request, res: Response) => {
  let uploadRequest = req as UploadRequest;
  const uploadFilename = `./uploads/${uploadRequest.files[0]["filename"]}`;
  const { filepath } = uploadRequest.body;
  const replaceFilename = `./uploads/${filepath}`;

  const date = Date.now();

  try {
    await fs.renameSync(uploadFilename, replaceFilename);

    const updateFile = await File.updateFile(filepath, date);
    console.log(updateFile);

    return res.status(201).send({ message: "file uploaded successfully" });
  } catch {
    res.status(500).send({ message: "file donot present in database" });
  }
};

export const getFileDetails = async (req: Request, res: Response) => {
  let uploadReq = req as UploadRequest;
  const { filepath } = uploadReq.body;

  try {
    const result: Array<any> = await File.getFileDetails(filepath);
    var accessUser = await User.getAccessListUser(filepath);
    var array = { ...result[0], accessUser };
    return res.status(200).send(array);
  } catch (err) {
    res.status(500).send({ message: "file donot present in database" });
  }
};

export const updateOwnership = async (req: Request, res: Response) => {
  let uploadRequest = req as UploadRequest;
  const date = Date.now();
  const { email, filepath } = uploadRequest.body;
  try {
    const userDetails: any = await User.getUserByEmail(email);
    if (!userDetails || !userDetails.length) {
      return res.status(404).send({ message: "User not found" });
    }
    const userid = userDetails[0].id;
    const fileStats = fs.statSync(`./uploads/${filepath}`);
    const size = fileStats.size;
    const totalsize: any = await File.fileSize(userid);
    const total = Number(totalsize[0].totalsize) + Number(size);
    if (total > Number(process.env.FILESIZE)) {
      return res.status(400).send({ message: "size limit exceed" });
    }

    let updateFile: any = await File.updateOwner(userid, filepath, date);
    if (updateFile[1] === 0) {
      return res
        .status(400)
        .send({ message: "Ownership have not transfered " });
    }

    return res.status(200).send({ message: "Ownership transfer successfully" });
  } catch (error) {
    res.status(500).send({ message: "file donot present in database" });
  }
};
