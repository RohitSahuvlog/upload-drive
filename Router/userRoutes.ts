import { Router } from "express";
import { registerUser, loginUser, getMyFiles, getActivity } from "../Controller/userController";
import authentication from "../Middleware/authentication";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/myfiles", authentication, getMyFiles);
router.get("/activity",  getActivity);

export default router;
