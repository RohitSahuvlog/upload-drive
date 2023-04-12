import { QueryTypes } from "sequelize";
import { sequelize } from "../Config/sequilize.db";
import { deleteFile } from "../Controller/fileController";

export class File {
  static async getFileDetails(filepath: String) {
    let sql1 = `SELECT  * from uploadinfo  where  filepath='${filepath}' `;
    var result = await sequelize.query(sql1, {
      type: QueryTypes.SELECT,
    });
    return result;
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
  static async addUpload(
    owner_id: number,
    filepath: String,
    filename: String,
    size: Number
  ) {
    let sql = `INSERT INTO uploadinfo  (owner_id,filepath, filename, size) VALUES (${owner_id},"${filepath}","${filename}", ${size}) `;
    var result = await sequelize.query(sql, { type: QueryTypes.INSERT });
    return result;
  }
  
  static async deleteFile(filepath: string) {
    let sql = `DELETE from uploadinfo where  filepath="${filepath}"`;
    const result = await sequelize.query(sql, { type: QueryTypes.DELETE });
    return result;
  }
}
