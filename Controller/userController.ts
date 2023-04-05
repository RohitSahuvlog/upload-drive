import { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../db_helper/user";
dotenv.config();

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, pic } = req.body;

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
};

//login
const logUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email && password) {
    var userDetails = await User.getUserByEmail(email);

    if (userDetails.length !== 0) {
      var hash = userDetails[0].password;

      bcrypt.compare(password, hash, (err: Error, users: any) => {
        if (err) {
          res.status(400);
          throw new Error("User not found");
        }

        if (users) {
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
        } else {
          return res
            .status(500)
            .send({ error: "You are writing incorrect password" });
        }
      });
    } else {
      return res.status(500).send({ error: "Your email is incorrect" });
    }
  } else {
    res
      .status(500)
      .send({ error: "Please Enter Email Address and Password Details" });
  }
};

export { registerUser, logUser };
