import { QueryTypes } from "sequelize";
import { sequelize } from "../Config/sequilize.db";

export class User {
  static insertUser(email: String, name: String, password: String) {
    let sql = `INSERT INTO user SET email="${email}",name="${name}",password="${password}"`;
    var result = sequelize
      .query(sql, { type: QueryTypes.INSERT })
      .then((res) => console.log(res))
      .catch((err) => err);
    return result;
  }
  static getUserByEmail(email: String) {
    var result = sequelize
      .query(`SELECT * FROM user WHERE email ='${email}'`, {
        type: QueryTypes.SELECT,
      })
      .then((res) => res)
      .catch((err) => err);
    return result;
  }

  static getUserById(userId: Number) {
    var result = sequelize
      .query(`SELECT * FROM user WHERE id=${userId}`, {
        type: QueryTypes.SELECT,
      })
      .then((res) => res)
      .catch((err) => err);
    return result;
  }
}
