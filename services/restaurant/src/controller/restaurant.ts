import { AuthenticationRequest } from "../middlewares/auth.js";
import TryCatch from "../middlewares/trycatch.js";
import Restaurant from "../model/Restaurant.js";

export const addRestaurant = TryCatch(async (req: AuthenticationRequest, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    // Check if restaurant already exists
    const existingRestaurant = await Restaurant.findOne({
        ownerId: user._id,
    });

    if (existingRestaurant) {
        return res.status(400).json({
            success: false,
            message: "You already own a restaurant.",
        });
    }

    const {
        name,
        description,
        phone,
        latitude,
        longitude,
        formattedAddress,
    } = req.body;

    console.log("Received restaurant data:", { name, description, phone, latitude, longitude, formattedAddress, });

    console.log("Received file data:", req.file);

    // Validate fields
    if (!name || !phone || !latitude || !longitude || !formattedAddress) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields.",
        });
    }

    // Validate image
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Restaurant image is required.",
        });
    }

    console.log("Image saved:", req.file.filename);

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/restaurants/${req.file.filename}`;
    console.log("Image URL:", imageUrl);


    // Create restaurant
    const restaurant = await Restaurant.create({
        name: name.trim(),
        description: description?.trim() || "",
        phone,

        image: imageUrl,

        ownerId: user._id,

        autoLocation: {
            type: "Point",
            coordinates: [
                Number(longitude),
                Number(latitude),
            ],
            formattedAddress,
        },

        isVerified: false,
        isOpen: false,
    });

    return res.status(201).json({
        success: true,
        message: "Restaurant created successfully.",
        restaurant,
    });

});

export const fetchRestaurant = TryCatch(async (req: AuthenticationRequest, res) => {
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

    return res.status(200).json({
        success: true,
        message: "Restaurant fetched successfully.",
        restaurant,
    });
});


export const toggleRestaurantStatus = TryCatch(async (req: AuthenticationRequest, res) => {
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
        return res.status(400).json({
            success: false,
            message: "Restaurant not found,",
        });
    }

    restaurant.isOpen = !restaurant.isOpen;

    await restaurant.save();

    return res.status(200).json({
        success: true,
        message: restaurant.isOpen ? "Restaurant is now open." : "Restaurant is now closed.",
        restaurant,
    })

});


export const editRestaurant = TryCatch(async (req: AuthenticationRequest, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }


    const { name, description } = req.body;
    if (!name?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Restaurant name is required.",
        });
    }

    const restaurant =
        await Restaurant.findOneAndUpdate(
            {
                ownerId: user._id,
            },
            {
                name: name.trim(),
                description: description?.trim() || "",
            },
            {
                new: true,
                runValidators: true,
            }
        );

    if (!restaurant) {
        return res.status(404).json({
            success: false,
            message:
                "Restaurant not found.",
        });
    }

    return res.status(200).json({
        success: true,
        message:
            "Restaurant updated successfully.",
        restaurant,
    });


})


