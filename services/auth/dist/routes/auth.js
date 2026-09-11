import express from "express";
import { addUserRole, loginUser, myProfile, getUserById } from "../controller/authController.js";
import { isAuth } from "../middleware/auth.js";
const router = express.Router();
router.post("/login", loginUser);
router.patch("/add/role", isAuth, addUserRole);
router.get("/profile", isAuth, myProfile);
router.get("/user/:id", getUserById);
export default router;
