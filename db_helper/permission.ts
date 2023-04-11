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
  static async ownerFile(userId: number) {
    let q1 = `SELECT  user.id,uploadinfo.id,filepath,create_at,update_at,size,owner_id,
  user_id,filename,name,email from user join uploadinfo  on user.id =uploadinfo.owner_id
   join permissions ON  permissions.uploadinfo_path =uploadinfo.filepath  where user_id=${userId}  `;

    var result = await sequelize.query(q1, {
      type: QueryTypes.SELECT,
    });

    return result;
  }
}
