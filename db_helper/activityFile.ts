import { QueryTypes } from "sequelize";
import { sequelize } from "../Config/sequilize.db";

export class Activities {
  static async addActivity(
    action: String,
    user_id: number,
    ipaddress: String,
    useragent: String,
    filename: String,
    status: String,
    other_user:String
  ) {
    let sql = `INSERT INTO Activity   (action,user, ipaddress,user_agent,filename,status,other_user) VALUES ("${action}",${user_id}, "${ipaddress}","${useragent}","${filename}","${status}","${other_user}") `;
    var result = await sequelize.query(sql, { type: QueryTypes.INSERT });
    return result;
  }
}
