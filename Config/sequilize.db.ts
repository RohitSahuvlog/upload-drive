import { Sequelize } from "sequelize";
require("dotenv-defaults").config();

 export const sequelize = new Sequelize(
  process.env.DB_DATABASENAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(`Database & tables created!`);
  })
  .catch((err) => console.log(err));


