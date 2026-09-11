import { AuthenticationRequest } from "../middlewares/auth.js";
import TryCatch from "../middlewares/trycatch.js";
import MenuItem from "../model/MenuItems.js";
import Restaurant from "../model/Restaurant.js";

// Add Menu Item
export const addMenuItem = TryCatch(async (req: AuthenticationRequest, res) => {
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
    if (!name || !price) {
        return res.status(404).json({
            success: false,
            message: "Name and price are required",
        });
    }

    if (Number(price) < 0) {
        return res.status(400).json({
            success: false,
            message: "Price must be a non-negative number.",
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
        price: Number(price),
        isAvailable: true,
    });

    return res.status(201).json({
        success: true,
        message: "Menu item added successfully.",
        menuItem,
    });

})

// Get All Menu Items for a Restaurant
export const getAllItems = TryCatch(async (req: AuthenticationRequest, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Restaurant ID is required.",
        });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({
            success: false, message: "Restaurant not found.",
        });
    }

    const menuItems = await MenuItem.find({
        restaurantId: restaurant._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: menuItems.length,
        menuItems,
    });

});


// Delete Menu Item
export const deleteMenuItem = TryCatch(async (req: AuthenticationRequest, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Restaurant ID is required.",
        });
    }

    const user = req.user;

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    // Find restaurant owned by logged-in user 
    const restaurant = await Restaurant.findOne({
        ownerId: user._id,
    });

    if (!restaurant) {
        return res.status(404).json({
            success: false,
            message: "Restaurant not found.",
        });
    }

    // Find menu item belonging to this restaurant
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

    await MenuItem.findByIdAndDelete(menuItem._id);

    return res.status(200).json({
        success: true,
        message: "Menu item deleted successfully.",
    });


});




