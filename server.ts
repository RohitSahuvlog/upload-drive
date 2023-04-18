import express from "express";
import bodyParser from "body-parser";
import fileRouter from "./Router/fileRouter";
import path from "path";
import userRoutes from "./Router/userRoutes";
import authentication from "./Middleware/authentication";
import "./Config/sequilize.db";
import permissionRouter from "./Router/permissonRoute";
import { activityLoggerMiddleware } from "./Middleware/activityLoggerMiddlewere";
import withOwnerdownload from "./Middleware/withOwnerdownload";
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(activityLoggerMiddleware);
app.use("/user", userRoutes);
app.use(authentication);
app.use("/file", fileRouter);
app.use("/permission", permissionRouter);
app.use("/uploads",withOwnerdownload, express.static(path.resolve("uploads")));

const port = 3000;
app.listen(port, function () {
  console.log("server started on port 3000");
});
