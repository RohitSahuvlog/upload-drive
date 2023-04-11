import { Router } from "express";

import { registerUser, loginUser, getFile } from "../Controller/userController";
import authentication from "../Middleware/authentication";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/myfiles", authentication, getFile);

export default router;
