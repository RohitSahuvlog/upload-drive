import { Request, Response } from "express";
import dotenv from "dotenv"; 
import connection from "../Config/db";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }
  connection.query(
    "SELECT email FROM user WHERE email =?",
    [email],
    async (err: Error, result: any) => {
      if (err) throw err;
      if (result.length > 0) {
        return res.send({ message: "this email already used" });
      }

      var t = await bcrypt.hash(password, 8);
      let sql = "INSERT INTO user SET ?";
      connection.query(
        sql,
        { name, email, password: t },
        (err: Error, user: any) => {
          if (err) {
            res.status(400);
          } else if (user) {
            return res.status(201).send("user Register successfull");
          }
        }
      );
    }
  );
};

//login
const authUser = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email && password) {
    let sql = `SELECT * FROM user WHERE email="${email}"`;

    connection.query(sql, (err: Error, user: any) => {
      if (err) throw err;
      if (user.length > 0) {
        var hash = user[0].password;
        bcrypt.compare(password, hash, (err: Error, users: any) => {
          if (err) {
            res.status(400);
            throw new Error("User not found");
          }

          if (users) {
            var token = jwt.sign(
              { email, userId: user[0].id },
              process.env.SECRET || ""
            );
            return res.status(200).send({
              id: user[0].id,
              name: user[0].name,
              email: user[0].email,
              pic: user[0].pic,
              token,
            });
          } else {
            return res.status(500).send(" incorrect password");
          }
        });
      } else {
        return res.status(500).send("incorrect email");
      }
    });
  } else {
    res.status(500).send("Please Enter Email Address and Password Details");
  }
};

export { registerUser, authUser };
