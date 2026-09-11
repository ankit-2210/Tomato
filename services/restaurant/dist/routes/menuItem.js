import express from "express";
import { isAuth, isSeller } from "../middlewares/auth.js";
import { addMenuItem } from "../controller/menuItem.js";
import uploadFile from "../middlewares/multer.js";
const router = express.Router();
router.post("/add", isAuth, isSeller, uploadFile, addMenuItem);
router.get("/all/:id", isAuth, isSeller, addMenuItem);
router.delete("/delete/:id", isAuth, isSeller, addMenuItem);
export default router;
