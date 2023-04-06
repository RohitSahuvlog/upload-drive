import { QueryTypes } from "sequelize";
import { sequelize } from "../Config/sequilize.db";

export class Permission {
  static async hasUserFileReadAccess(userId: number, Id: String) {
    var result = await sequelize.query(
      `SELECT * from permissions where user_id=${userId} AND  uploadinfo_path="${Id}" `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (result.length !== 0) {
      return true;
    } else {
      return false;
    }
  }
  static async hasUserFileUpdateAccess(userId: number, Id: String) {
    var result = await sequelize.query(
      `SELECT * from permissions where user_id=${userId} AND  uploadinfo_path="${Id}" AND permission_type=2  `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (result.length !== 0) {
      return true;
    } else {
      return false;
    }
  }
  static async hasOwnerFileAccess(userId: number, Id: String) {
    var result = await sequelize.query(
      `SELECT * from uploadinfo where owner_id=${userId} AND  filepath="${Id}"`,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (result.length !== 0) {
      return true;
    } else {
      return false;
    }
  }
  static async hasOwnerFile(userId: number) {
    let sql1 = `SELECT * from uploadinfo where owner_id=${userId} `;
    var result = await sequelize.query(sql1, {
      type: QueryTypes.SELECT,
    });

    return result;
  }
}
