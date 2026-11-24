import mongoose from "mongoose";
import type { Response } from "express";

import { AuthenticationRequest } from "../middlewares/auth.js";
import  TryCatch  from "../middlewares/trycatch.js";
import Cart from "../model/Cart.js";
import MenuItem from "../model/MenuItems.js";
import Restaurant from "../model/Restaurant.js";

const MAX_ITEM_QUANTITY = 20;

/**
 * Validate MongoDB ObjectId
 */
const isValidObjectId = (id: unknown): boolean => {
    return (
        typeof id === "string" &&
        mongoose.Types.ObjectId.isValid(id)
    );
};

/**
 * Calculate cart totals.
 *
 * subtotal is always calculated from the backend-stored
 * item price and quantity.
 */
const calculateCartTotals = (items: any[]) => {
    let totalItems = 0;
    let subtotal = 0;

    for (const item of items) {
        item.subtotal = Number(
            (item.price * item.quantity).toFixed(2)
        );

        totalItems += item.quantity;
        subtotal += item.subtotal;
    }

    return {
        totalItems,
        subtotal: Number(subtotal.toFixed(2)),
    };
};

/**
 * GET /api/cart
 *
 * Get the authenticated user's cart.
 */
export const getCart = TryCatch(
    async (req: AuthenticationRequest, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        const cart = await Cart.findOne({
            userId: req.user._id,
        })
            .populate(
                "restaurantId",
                "name image phone isOpen isVerified"
            )
            .lean();

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty.",
                cart: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully.",
            cart,
        });
    }
);

/**
 * POST /api/cart/add
 *
 * Add a menu item to the user's cart.
 *
 * Body:
 * {
 *   restaurantId?: string,
 *   menuItemId: string,
 *   quantity?: number,
 *   replaceCart?: boolean
 * }
 */
export const addToCart = TryCatch(
    async (req: AuthenticationRequest, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        const {
            restaurantId,
            menuItemId,
            quantity = 1,
            replaceCart = false,
        } = req.body;

        // -----------------------------------------
        // Validate menu item ID
        // -----------------------------------------

        if (
            typeof menuItemId !== "string" ||
            !isValidObjectId(menuItemId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid menu item ID.",
            });
        }

        // -----------------------------------------
        // Validate optional restaurant ID
        // -----------------------------------------

        if (
            restaurantId !== undefined &&
            restaurantId !== null &&
            !isValidObjectId(restaurantId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid restaurant ID.",
            });
        }

        // -----------------------------------------
        // Validate quantity
        // -----------------------------------------

        if (
            typeof quantity !== "number" ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > MAX_ITEM_QUANTITY
        ) {
            return res.status(400).json({
                success: false,
                message: `Quantity must be between 1 and ${MAX_ITEM_QUANTITY}.`,
            });
        }

        // -----------------------------------------
        // Find menu item
        // -----------------------------------------

        const menuItem = await MenuItem.findOne({
            _id: menuItemId,
            isAvailable: true,
        }).lean();

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found or currently unavailable.",
            });
        }

        // -----------------------------------------
        // Derive restaurant from menu item
        //
        // Do NOT trust restaurantId from frontend
        // as the source of truth.
        // -----------------------------------------

        const actualRestaurantId =
            menuItem.restaurantId.toString();

        // If frontend sent restaurantId, make sure
        // it matches the menu item's restaurant.
        if (
            restaurantId !== undefined &&
            restaurantId !== null &&
            restaurantId !== actualRestaurantId
        ) {
            return res.status(400).json({
                success: false,
                message: "Menu item does not belong to the selected restaurant.",
            });
        }

        // -----------------------------------------
        // Verify restaurant
        // -----------------------------------------

        const restaurant = await Restaurant.findOne({
            _id: menuItem.restaurantId,
            isVerified: true,
        }).lean();

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found or not verified.",
            });
        }

        // -----------------------------------------
        // Find user's cart
        // -----------------------------------------

        let cart = await Cart.findOne({
            userId: req.user._id,
        });

        // -----------------------------------------
        // Create new cart
        // -----------------------------------------

        if (!cart) {
            const itemSubtotal = Number(
                (menuItem.price * quantity).toFixed(2)
            );

            cart = await Cart.create({
                userId: req.user._id,
                restaurantId: menuItem.restaurantId,
                items: [
                    {
                        menuItemId: menuItem._id,
                        name: menuItem.name,
                        image: menuItem.image,
                        price: menuItem.price,
                        quantity,
                        subtotal: itemSubtotal,
                    },
                ],
                totalItems: quantity,
                subtotal: itemSubtotal,
            });

            await cart.populate(
                "restaurantId",
                "name image phone isOpen isVerified"
            );

            return res.status(201).json({
                success: true,
                message: "Item added to cart successfully.",
                cart,
            });
        }

        // -----------------------------------------
        // Check restaurant mismatch
        // -----------------------------------------

        const cartRestaurantId =
            cart.restaurantId.toString();

        if (cartRestaurantId !== actualRestaurantId) {
            // User wants to replace the existing cart
            // with the new restaurant's item.
            if (replaceCart === true) {
                const itemSubtotal = Number(
                    (menuItem.price * quantity).toFixed(2)
                );

                cart.restaurantId = menuItem.restaurantId;

                cart.items = [
                    {
                        menuItemId: menuItem._id,
                        name: menuItem.name,
                        image: menuItem.image,
                        price: menuItem.price,
                        quantity,
                        subtotal: itemSubtotal,
                    },
                ];

                cart.totalItems = quantity;
                cart.subtotal = itemSubtotal;

                await cart.save();

                await cart.populate(
                    "restaurantId",
                    "name image phone isOpen isVerified"
                );

                return res.status(200).json({
                    success: true,
                    message: "Cart replaced with items from the new restaurant.",
                    cart,
                });
            }

            return res.status(409).json({
                success: false,
                message:
                    "Your cart contains items from another restaurant.",
                code: "DIFFERENT_RESTAURANT",
                currentRestaurantId: cart.restaurantId,
                requestedRestaurantId: menuItem.restaurantId,
                requiresCartReplacement: true,
            });
        }

        // -----------------------------------------
        // Same restaurant
        // Check whether item already exists
        // -----------------------------------------

        const existingItem = cart.items.find(
            (item) =>
                item.menuItemId.toString() === menuItemId
        );

        if (existingItem) {
            const newQuantity =
                existingItem.quantity + quantity;

            if (newQuantity > MAX_ITEM_QUANTITY) {
                return res.status(400).json({
                    success: false,
                    message: `Maximum quantity for an item is ${MAX_ITEM_QUANTITY}.`,
                });
            }

            // Refresh snapshot from database
            existingItem.name = menuItem.name;
            existingItem.image = menuItem.image;
            existingItem.price = menuItem.price;
            existingItem.quantity = newQuantity;

            existingItem.subtotal = Number(
                (
                    existingItem.price *
                    existingItem.quantity
                ).toFixed(2)
            );
        } else {
            // -----------------------------------------
            // Add new item
            // -----------------------------------------

            cart.items.push({
                menuItemId: menuItem._id,
                name: menuItem.name,
                image: menuItem.image,
                price: menuItem.price,
                quantity,
                subtotal: Number(
                    (menuItem.price * quantity).toFixed(2)
                ),
            });
        }

        // -----------------------------------------
        // Recalculate totals
        // -----------------------------------------

        const totals = calculateCartTotals(cart.items);

        cart.totalItems = totals.totalItems;
        cart.subtotal = totals.subtotal;

        await cart.save();

        await cart.populate(
            "restaurantId",
            "name image phone isOpen isVerified"
        );

        return res.status(200).json({
            success: true,
            message: "Item added to cart successfully.",
            cart,
        });
    }
);

/**
 * PATCH /api/cart/item/:menuItemId
 *
 * Update quantity of an existing cart item.
 *
 * Body:
 * {
 *   quantity: number
 * }
 */
export const updateCartItem = TryCatch(
    async (req: AuthenticationRequest, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        // IMPORTANT:
        // Do not destructure req.params directly because
        // TypeScript may consider the value undefined.
        const menuItemId = req.params.menuItemId;

        // -----------------------------------------
        // Validate menu item ID
        // -----------------------------------------

        if (
            typeof menuItemId !== "string" ||
            !isValidObjectId(menuItemId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid menu item ID.",
            });
        }

        const { quantity } = req.body;

        // -----------------------------------------
        // Validate quantity
        // -----------------------------------------

        if (
            typeof quantity !== "number" ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > MAX_ITEM_QUANTITY
        ) {
            return res.status(400).json({
                success: false,
                message: `Quantity must be between 1 and ${MAX_ITEM_QUANTITY}.`,
            });
        }

        // -----------------------------------------
        // Find user's cart
        // -----------------------------------------

        const cart = await Cart.findOne({
            userId: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found.",
            });
        }

        // -----------------------------------------
        // Find item inside cart
        // -----------------------------------------

        const cartItem = cart.items.find(
            (item) =>
                item.menuItemId.toString() === menuItemId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item is not present in the cart.",
            });
        }

        // -----------------------------------------
        // Verify menu item is still available
        // -----------------------------------------

        const menuItem = await MenuItem.findOne({
            _id: menuItemId,
            restaurantId: cart.restaurantId,
            isAvailable: true,
        }).lean();

        if (!menuItem) {
            return res.status(400).json({
                success: false,
                message:
                    "This menu item is no longer available.",
            });
        }

        // -----------------------------------------
        // Update item snapshot
        //
        // Price comes from database, never frontend.
        // -----------------------------------------

        cartItem.name = menuItem.name;
        cartItem.image = menuItem.image;
        cartItem.price = menuItem.price;
        cartItem.quantity = quantity;

        cartItem.subtotal = Number(
            (
                menuItem.price *
                quantity
            ).toFixed(2)
        );

        // -----------------------------------------
        // Recalculate cart totals
        // -----------------------------------------

        const totals = calculateCartTotals(cart.items);

        cart.totalItems = totals.totalItems;
        cart.subtotal = totals.subtotal;

        await cart.save();

        await cart.populate(
            "restaurantId",
            "name image phone isOpen isVerified"
        );

        return res.status(200).json({
            success: true,
            message: "Cart item updated successfully.",
            cart,
        });
    }
);

/**
 * DELETE /api/cart/item/:menuItemId
 *
 * Remove a menu item from cart.
 */
export const removeFromCart = TryCatch(
    async (req: AuthenticationRequest, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        // IMPORTANT:
        // Keep this as a direct assignment instead of
        // destructuring req.params.
        const menuItemId = req.params.menuItemId;

        // -----------------------------------------
        // Validate menu item ID
        // -----------------------------------------

        if (
            typeof menuItemId !== "string" ||
            !isValidObjectId(menuItemId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid menu item ID.",
            });
        }

        // -----------------------------------------
        // Find user's cart
        // -----------------------------------------

        const cart = await Cart.findOne({
            userId: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found.",
            });
        }

        // -----------------------------------------
        // Check whether item exists
        // -----------------------------------------

        const itemExists = cart.items.some(
            (item) =>
                item.menuItemId.toString() === menuItemId
        );

        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: "Menu item is not present in the cart.",
            });
        }

        // -----------------------------------------
        // Remove item
        // -----------------------------------------

        cart.items = cart.items.filter(
            (item) =>
                item.menuItemId.toString() !== menuItemId
        );

        // -----------------------------------------
        // If cart becomes empty, delete it
        // -----------------------------------------

        if (cart.items.length === 0) {
            await Cart.deleteOne({
                _id: cart._id,
            });

            return res.status(200).json({
                success: true,
                message: "Item removed and cart is now empty.",
                cart: null,
            });
        }

        // -----------------------------------------
        // Recalculate totals
        // -----------------------------------------

        const totals = calculateCartTotals(cart.items);

        cart.totalItems = totals.totalItems;
        cart.subtotal = totals.subtotal;

        await cart.save();

        await cart.populate(
            "restaurantId",
            "name image phone isOpen isVerified"
        );

        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully.",
            cart,
        });
    }
);

/**
 * DELETE /api/cart/clear
 *
 * Completely clear the user's cart.
 */
export const clearCart = TryCatch(
    async (req: AuthenticationRequest, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        await Cart.deleteOne({
            userId: req.user._id,
        });

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully.",
            cart: null,
        });
    }
);