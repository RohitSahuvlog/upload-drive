import { QueryTypes } from "sequelize";
import { sequelize } from "../Config/sequilize.db";

export class Permission {
  static async getUserByfilepath(Id: String) {
    var result = await sequelize.query(
      `SELECT * from permissions where  filepath="${Id}"`,
      {
        type: QueryTypes.SELECT,
      }
    );

    return result;
  }
}
