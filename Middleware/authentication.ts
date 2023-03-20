import { NextFunction, Request, Response } from "express";
require("dotenv").config();
const jwt = require("jsonwebtoken");
interface MyUserRequest extends Request {
    auth?: string;
    userId?:string
}

const authentication = (
  req: MyUserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.send("please login again");
  }

  try {
    const user_token = req.headers.authorization.split(" ")[1];

    jwt.verify(user_token, process.env.SECRET, (err: Error, decoded: any) => {
      if (err) {
        return res.send("please login agains");
      }
      req.auth = decoded.email;
      req.userId = decoded.userId;

      next();
    });
  } catch {
    res.status(500).send("err in authentication");
  }
};

export default authentication;
