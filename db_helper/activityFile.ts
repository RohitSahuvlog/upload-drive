import { QueryTypes } from "sequelize";
import { sequelize } from "../Config/sequilize.db";

export class Activities {
  static async addActivity(
    action: String,
    user_id: number,
    ipaddress: String,
    useragent: String,
    filename: String,
    status: String
  ) {
    let sql = `INSERT INTO Activity   (action,user, ipaddress,user_agent,filename,status) VALUES ("${action}",${user_id}, "${ipaddress}","${useragent}","${filename}","${status}") `;
    var result = await sequelize.query(sql, { type: QueryTypes.INSERT });
    return result;
  }
}
