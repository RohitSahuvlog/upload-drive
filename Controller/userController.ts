import { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../db_helper/user";
import { File } from "../db_helper/file";
dotenv.config();

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter all the Feilds");
    }
    var userDetails: any = await User.getUserByEmail(email);

    if (userDetails.length > 0) {
      return res.send({ message: "Email id is used" });
    }

    var hashpassword = await bcrypt.hash(password, 8);

    var insertResponse: any = await User.insertUser(email, name, hashpassword);

    if (insertResponse) {
      return res.status(201).send({ message: "User registered successfully" });
    } else {
      return res
        .status(400)
        .send({ message: "User registration failed please try again later" });
    }
  } catch (error) {
    res.status(500).send({ error: "internal server error" });
  }
};

//login
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email && !password) {
      return res
        .status(400)
        .send({ error: "Please Enter Email Address and Password Details" });
    }

    var userDetails: any = await User.getUserByEmail(email);
    if (userDetails.length == 0) {
      return res.status(400).send({ error: "User not found" });
    }

    var hash = userDetails[0].password;
    var users = await bcrypt.compare(password, hash);

    if (!users) {
      return res.status(400).send({ error: "Incorrect password" });
    }

    var token = jwt.sign(
      { email, userId: userDetails[0].id },
      process.env.JWT_SECRET || ""
    );
    return res.status(200).send({
      id: userDetails[0].id,
      name: userDetails[0].name,
      email: userDetails[0].email,
      pic: userDetails[0].pic,
      token,
    });
  } catch (error) {
    res.status(500).send({ error: "internal server error" });
  }
};

interface uploadRequest extends Request {
  userId?: any;
  files: Array<any>;
}
const getFile = async (req: Request, res: Response) => {
  let uploadReq = req as uploadRequest;

  try {
    const ownerFile: Array<any> = await File.ownerFile(uploadReq.userId);
    for (var i = 0; i < ownerFile.length; i++) {
      ownerFile[i] = {
        ...ownerFile[i],
        ownername: ownerFile[i].name,
        owneremail: ownerFile[i].email,
      };
      delete ownerFile[i].name;
      delete ownerFile[i].email;
    }
    return res.status(200).send({ ownerFile });
  } catch {
    res.status(500).send({ error: "file donot present in database" });
  }
};

export { registerUser, loginUser, getFile };
