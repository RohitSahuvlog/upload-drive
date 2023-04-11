import { QueryTypes } from "sequelize";
import { sequelize } from "../Config/sequilize.db";

export class User {
  static async insertUser(email: String, name: String, password: String) {
    let sql = `INSERT INTO user SET email="${email}",name="${name}",password="${password}"`;
    var result = await sequelize
      .query(sql, { type: QueryTypes.INSERT })
      return result;
  }
  static async getUserByEmail(email: String) {
    var result = await sequelize
      .query(`SELECT * FROM user WHERE email ='${email}'`, {
        type: QueryTypes.SELECT,
      })
     return result;
  }

  static async getUserById(userId: Number) {
    var result = await sequelize
      .query(`SELECT user.id,name,email FROM user WHERE id=${userId}`, {
        type: QueryTypes.SELECT,
      });
     
    return result;
  }
  static async getOwnerFileDetails(userId: Number, filepath:String) {
    let sql1 = `SELECT DISTINCT user.id,uploadinfo.id,filepath,create_at,update_at,size,owner_id,
  user_id,filename,name,email from user join uploadinfo  on uploadinfo.owner_id=user.id 
   join permissions ON  permissions.uploadinfo_path =uploadinfo.filepath where  filepath='${filepath}' `;

    var result = await sequelize.query(sql1, {
      type: QueryTypes.SELECT,
    });
     return result;
  }
}
