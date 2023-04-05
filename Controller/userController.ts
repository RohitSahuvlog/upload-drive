import { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../db_helper/user";
dotenv.config();

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter all the Feilds");
    }
    var userDetails = await User.getUserByEmail(email);

    if (userDetails.length > 0) {
      return res.send({ message: "this email  used already" });
    }

    var hashpassword = await bcrypt.hash(password, 8);

    var insertResponse = await User.insertUser(email, name, hashpassword);
    if (insertResponse) {
      return res
        .status(201)
        .send({ message: " this user have  Registered successfully" });
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
        .status(500)
        .send({ error: "Please Enter Email Address and Password Details" });
    }

    var userDetails = await User.getUserByEmail(email);
    if (userDetails.length == 0) {
      return res.status(500).send({ error: "Your email is incorrect" });
    }

    var hash = userDetails[0].password;
    var users = await bcrypt.compare(password, hash);

    if (!users) {
      return res
        .status(500)
        .send({ error: "You are writing incorrect password" });
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

export { registerUser, loginUser };
