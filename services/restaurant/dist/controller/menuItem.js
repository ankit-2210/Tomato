import mongoose from "mongoose";
import TryCatch from "../middlewares/trycatch.js";
import MenuItem from "../model/MenuItems.js";
import Restaurant from "../model/Restaurant.js";
// Add Menu Item
export const addMenuItem = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const restaurant = await Restaurant.findOne({
        ownerId: user._id,
    });
    if (!restaurant) {
        return res.status(404).json({
            success: false,
            message: "Restaurant not found.",
        });
    }
    const { name, description, price } = req.body;
    if (!name || price === undefined) {
        return res.status(404).json({
            success: false,
            message: "Name and price are required",
        });
    }
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid price.",
        });
    }
    // Validate image
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Menu Items image is required.",
        });
    }
    console.log("Image saved:", req.file.filename);
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/menuItems/${req.file.filename}`;
    console.log("Image URL:", imageUrl);
    const menuItem = new MenuItem({
        restaurantId: restaurant._id,
        name,
        description,
        image: imageUrl,
        price: numericPrice,
        isAvailable: true,
    });
    return res.status(201).json({
        success: true,
        message: "Menu item added successfully.",
        menuItem,
    });
});
// GET ALL MENU ITEMS
export const getAllItems = TryCatch(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Restaurant ID is required.",
        });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid restaurant ID.",
        });
    }
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({
            success: false,
            message: "Restaurant not found.",
        });
    }
    const menuItems = await MenuItem.find({
        restaurantId: id,
    }).sort({
        createdAt: -1
    });
    return res.status(200).json({
        success: true,
        count: menuItems.length,
        menuItems,
    });
});
// GET SINGLE MENU ITEM
export const getSingleItem = TryCatch(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Menu Item ID is required.",
        });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid menu item ID.",
        });
    }
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
        return res.status(404).json({
            success: false,
            message: "Menu item not found.",
        });
    }
    return res.status(200).json({
        success: true,
        menuItem,
    });
});
// UPDATE MENU ITEM
export const updateMenuItem = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized.",
        });
    }
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid menu item ID.",
        });
    }
    const restaurant = await Restaurant.findOne({
        ownerId: user._id,
    });
    if (!restaurant) {
        return res.status(404).json({
            success: false,
            message: "Restaurant not found.",
        });
    }
    const menuItem = await MenuItem.findOne({
        _id: id,
        restaurantId: restaurant._id,
    });
    if (!menuItem) {
        return res.status(404).json({
            success: false,
            message: "Menu item not found.",
        });
    }
    const { name, description, price } = req.body;
    if (name !== undefined) {
        menuItem.name = name;
    }
    if (description !== undefined) {
        menuItem.description = description;
    }
    if (price !== undefined) {
        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid price.",
            });
        }
        menuItem.price = numericPrice;
    }
    if (req.file) {
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/menuItems/${req.file.filename}`;
        menuItem.image = imageUrl;
    }
    await menuItem.save();
    return res.status(200).json({
        success: true,
        menuItem,
    });
});
// DELETE MENU ITEM
export const deleteMenuItem = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized.",
        });
    }
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid menu item ID.",
        });
    }
    const restaurant = await Restaurant.findOne({
        ownerId: user._id,
    });
    if (!restaurant) {
        return res.status(404).json({
            success: false,
            message: "Restaurant not found.",
        });
    }
    const menuItem = await MenuItem.findOne({
        _id: id,
        restaurantId: restaurant._id,
    });
    if (!menuItem) {
        return res.status(404).json({
            success: false,
            message: "Menu item not found.",
        });
    }
    await MenuItem.findByIdAndDelete(id);
    return res.status(200).json({
        success: true,
        message: "Menu item deleted successfully.",
    });
});
// TOGGLE AVAILABILITY
export const toggleAvailability = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized.",
        });
    }
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid menu item ID.",
        });
    }
    const restaurant = await Restaurant.findOne({
        ownerId: user._id,
    });
    if (!restaurant) {
        return res.status(404).json({
            success: false,
            message: "Restaurant not found.",
        });
    }
    const menuItem = await MenuItem.findOne({
        _id: id,
        restaurantId: restaurant._id,
    });
    if (!menuItem) {
        return res.status(404).json({
            success: false,
            message: "Menu item not found.",
        });
    }
    menuItem.isAvailable = !menuItem.isAvailable;
    return res.status(200).json({
        success: true,
        message: menuItem.isAvailable
            ? "Menu item is now available."
            : "Menu item is now unavailable.",
        isAvailable: menuItem.isAvailable,
    });
});
// SEARCH MENU ITEMS
export const searchMenuItems = TryCatch(async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const { search } = req.query;
    if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid restaurant ID.",
        });
    }
    if (!search || typeof search !== "string") {
        return res.status(400).json({
            success: false,
            message: "Search query is required.",
        });
    }
    const menuItems = await MenuItem.find({
        restaurantId,
        $or: [
            {
                name: {
                    $regex: search,
                    $options: "i",
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i",
                }
            },
        ]
    }).sort({
        createdAt: -1
    });
    return res.status(200).json({
        success: true,
        count: menuItems.length,
        menuItems,
    });
});
