import { Router } from "express";

import {
    addRestaurant,
    fetchRestaurant,
    toggleRestaurantStatus,
    editRestaurant,
    fetchAllRestaurants,
    fetchRestaurantById,
    searchRestaurants,
} from "../controller/restaurant.js";

import { isAuth, isSeller } from "../middlewares/auth.js";
import uploadFile from "../middlewares/multer.js";

const router = Router();

// ---------------------------------------------
// Seller routes
// ---------------------------------------------

// Create a restaurant
router.post("/add", isAuth, isSeller, uploadFile, addRestaurant);

// Fetch the logged-in seller's restaurant
router.get("/", isAuth, isSeller, fetchRestaurant);

// Edit restaurant details
router.patch("/edit", isAuth, isSeller, editRestaurant);

// Toggle restaurant open/closed status
router.patch("/toggle-open", isAuth, isSeller, toggleRestaurantStatus);



// ---------------------------------------------
// Customer-facing routes
// ---------------------------------------------

// Fetch all restaurants
router.get("/all", fetchAllRestaurants);

// Search restaurants by name
router.get("/search", searchRestaurants);

// Fetch a restaurant by ID
router.get("/:id", fetchRestaurantById);




export default router;




