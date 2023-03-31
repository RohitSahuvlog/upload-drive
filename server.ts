import express from "express";
import bodyParser from "body-parser";
import router from "./Router/fileRouter";
import path from "path";
import userRoutes from "./Router/userRoutes";
import authentication from "./Middleware/authentication";
import { checkupload } from "./Middleware/checkuploadmiddlewere";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));

app.use("/user", userRoutes);
app.use(authentication);
app.use("/file", router);
app.use("/uploads", checkupload, express.static(path.resolve("uploads")));

const port = 3000;
console.log("check");
app.listen(port, function () {
  console.log("server started on port 3000");
});
