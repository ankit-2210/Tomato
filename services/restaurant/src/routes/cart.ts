import { Router } from "express";

import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "../controller/cart.js";

import {
    isAuth,
} from "../middlewares/auth.js";


const router = Router();


// Get current user's cart
router.get("/", isAuth, getCart);

// Add menu item
router.post("/items", isAuth, addToCart);

// Update quantity
router.patch("/items/:menuItemId", isAuth, updateCartItem);

// Remove item
router.delete("/items/:menuItemId", isAuth, removeFromCart);

// Clear entire cart
router.delete("/", isAuth, clearCart);


export default router;