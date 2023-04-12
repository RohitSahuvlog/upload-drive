import { NextFunction, Request, Response } from "express";
import { UploadRequest } from "../Config/uploadRequest";
require("dotenv").config();
const jwt = require("jsonwebtoken");

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const uploadReq = req as UploadRequest;

  if (!uploadReq.headers.authorization) {
    return res.status(403).send({ message: "you are Unauthorize" });
  }

  try {
    const user_token = uploadReq.headers.authorization.split(" ")[1];

    jwt.verify(
      user_token,
      process.env.JWT_SECRET,
      (err: Error, decoded: any) => {
        if (err) {
          return res.status(403).send({ message: "you are Unauthorize" });
        }
        uploadReq.auth = decoded.email;
        uploadReq.userId = decoded.userId;

        next();
      }
    );
  } catch {
    res.status(500).send({ error: "error found  in authentication" });
  }
};

export default authentication;
