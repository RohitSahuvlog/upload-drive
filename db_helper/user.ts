import { QueryTypes } from "sequelize";
import { sequelize } from "../Config/sequilize.db";

export class User {
  static async insertUser(email: String, name: String, password: String) {
    let sql = `INSERT INTO user SET email="${email}",name="${name}",password="${password}"`;
    var result = await sequelize.query(sql, { type: QueryTypes.INSERT });
    return result;
  }
  static async getUserByEmail(email: String) {
    var result = await sequelize.query(
      `SELECT * FROM user WHERE email ='${email}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    return result;
  }

  static async getUserById(userId: Number) {
    var result = await sequelize.query(
      `SELECT user.id,name,email FROM user WHERE id=${userId}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    return result;
  }

  static async getAccessListUser(filepath: String) {
    let sql1 = `SELECT user.id,name,email,permission_type
    from permissions join user on permissions.user_id=user.id 
    where uploadinfo_path="${filepath}"`;
    var result = await sequelize.query(sql1, {
      type: QueryTypes.SELECT,
    });
    return result;
  }
}
