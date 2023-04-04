import { Sequelize } from "sequelize";

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
