import { NextFunction, Request, Response } from "express";
require("dotenv").config();
const jwt = require("jsonwebtoken");
interface MyUserRequest extends Request {
  auth?: string;
  userId?: string;
}

const authentication = (
  req: MyUserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.send({ error: "please login again" });
  }

  try {
    const user_token = req.headers.authorization.split(" ")[1];

    jwt.verify(user_token, process.env.SECRET, (err: Error, decoded: any) => {
      if (err) {
        return res.send({ message: "please login again" });
      }
      req.auth = decoded.email;
      req.userId = decoded.userId;

      next();
    });
  } catch {
    res.status(500).send({ error: "error found  in authentication" });
  }
};

export default authentication;
