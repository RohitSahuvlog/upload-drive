import { Router } from "express";
// import { postImage } from "../Controller/ImageController";


import  upload from "../Middleware/Imageconfig";
const router = Router();
// router.post("/post", upload.fields([{ name: 'image'}]), postImage);
export default router