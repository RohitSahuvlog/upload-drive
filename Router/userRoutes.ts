import { Router } from "express";
import { registerUser, authUser } from "../Controller/userController";

const router = Router();

router.route("/register").post(registerUser);
router.post("/login", authUser);

export default router;
