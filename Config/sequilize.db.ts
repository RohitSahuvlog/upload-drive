import { Sequelize, DataType } from "sequelize-typescript";

var mysql = require("mysql");
const sequelize = new Sequelize("fileuploads", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log(`Database & tables created!`);
  })
  .catch((err) => console.log(err));
