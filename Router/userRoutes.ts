import { Router } from "express";
import { registerUser, loginUser, getMyFiles } from "../Controller/userController";
import authentication from "../Middleware/authentication";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/myfiles", authentication, getMyFiles);

export default router;
