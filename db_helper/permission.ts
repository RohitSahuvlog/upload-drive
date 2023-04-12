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
  static async addPermision(
    uploadinfo_path: String,
    user_id: number,
    permission_type: number
  ) {
    let sql = `INSERT INTO permissions  (uploadinfo_path,user_id, permission_type) VALUES ("${uploadinfo_path}",${user_id}, ${permission_type}) `;
    var result = await sequelize.query(sql, { type: QueryTypes.INSERT });
    return result;
  }

  static async updatePermission(
    uploadinfo_path: string,
    user_id: number,
    permission_type: string
  ) {
    const sql = `UPDATE permissions SET uploadinfo_path = ?, permission_type = ? WHERE user_id = ?`;
    const result = await sequelize.query(sql, {
      type: QueryTypes.UPDATE,
      replacements: [uploadinfo_path, permission_type, user_id],
    });
    return result;
  }

  static async deletePermission(filepath: string) {
    let sql = `DELETE from permissions where  uploadinfo_path="${filepath}"`;
    const result = await sequelize.query(sql, { type: QueryTypes.DELETE });
    return result;
  }
  static async deleteSpecificPermission(user_id:Number,filepath: string) {
    let sql = `DELETE from permissions where  user_id=${user_id}  AND uploadinfo_path="${filepath}"`;
    const result = await sequelize.query(sql, { type: QueryTypes.DELETE });
    return result;
  }
}
