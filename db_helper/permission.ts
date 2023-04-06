import { QueryTypes } from "sequelize";
import { sequelize } from "../Config/sequilize.db";

export class Permission {
  static async getUserByfilepath( userId:number,Id: String) {
    var result = await sequelize.query(
      `SELECT * from permissions where user_id=${userId} AND  uploadinfo_path="${Id}"`,
      {
        type: QueryTypes.SELECT,
      }
    );

    return result;
  }
}
