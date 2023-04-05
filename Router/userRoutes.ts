import { Router } from "express";
import { registerUser, logUser } from "../Controller/userController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", logUser);

export default router;
