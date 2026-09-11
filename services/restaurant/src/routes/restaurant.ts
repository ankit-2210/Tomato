import express from "express";
import { isAuth, isSeller } from "../middlewares/auth.js";
import { addRestaurant, fetchRestaurant, toggleRestaurantStatus, editRestaurant } from "../controller/restaurant.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/add", isAuth, isSeller, uploadFile, addRestaurant);
router.get("/", isAuth, isSeller, fetchRestaurant);

router.patch("/toggle-open", isAuth, isSeller, toggleRestaurantStatus);
router.patch("/edit", isAuth, isSeller, editRestaurant);


export default router;




