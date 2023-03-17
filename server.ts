import express from "express";
import methodOverride from 'method-override';
import bodyParser from 'body-parser'
import router from "./Router/imageRouter"

const app = express();
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'))
app.use("/uploadimage",router)
const port = 3000;
console.log("check")
app.listen(port, function () {
    console.log("server started on port 3000");
});
