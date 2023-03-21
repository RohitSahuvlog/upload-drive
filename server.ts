import express from "express";
import methodOverride from "method-override";
import bodyParser from "body-parser";
import router from "./Router/imageRouter";
import path from "path";
import userRoutes from "./Router/userRoutes";
import authentication from "./Middleware/authentication";
import {checkupload} from "./Middleware/uploadmiddle2";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));

app.use(methodOverride("X-HTTP-Method-Override"));
// Public
app.use("/api/user", userRoutes);
app.use(authentication);
app.use("/uploadfile", router);
app.use("/uploads", checkupload, express.static(path.resolve("uploads")));
const port = 3000;
console.log("check");
app.listen(port, function () {
  console.log("server started on port 3000");
});
