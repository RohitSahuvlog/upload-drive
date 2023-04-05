import { QueryTypes } from "sequelize";
import { sequelize } from "../Config/sequilize.db";

export class User {
  static async insertUser(email: String, name: String, password: String) {
    let sql = `INSERT INTO user SET email="${email}",name="${name}",password="${password}"`;
     await sequelize
      .query(sql, { type: QueryTypes.INSERT })
      .then((res) => {
        return res;
      })
      .catch((err) =>{
        return err;
      });
  }
  static async getUserByEmail(email: String) {
     await sequelize
      .query(`SELECT * FROM user WHERE email ='${email}'`, {
        type: QueryTypes.SELECT,
      })
         .then((res) => {
             console.log("in getuserbyemail respose is b ",res)
        return res;
      })
      .catch((err) =>  {
        return err;
      });
  }

  static async getUserById(userId: Number) {
   await sequelize
      .query(`SELECT * FROM user WHERE id=${userId}`, {
        type: QueryTypes.SELECT,
      })
      .then((res) => {return res } )
        .catch((err) =>{ return err});
     
    
  }
}
