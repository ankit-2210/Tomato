
import mongoose from "mongoose";
import type { Request, Response } from "express";

import type { AuthenticationRequest } from "../middlewares/auth.js";
import TryCatch from "../middlewares/trycatch.js";
import Restaurant from "../model/Restaurant.js";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const escapeRegex = (value: string): string =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getPagination = (req: Request) => {
    const parsedPage = Number(req.query.page) || 1;
    const parsedLimit = Number(req.query.limit) || 10;

    const page = Math.max(1, Math.floor(parsedPage));
    const limit = Math.min(50, Math.max(1, Math.floor(parsedLimit)));

    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
};

// --------------------------------------------------
// Add restaurant
// POST /api/restaurant/add
// --------------------------------------------------

export const addRestaurant = TryCatch(
    async (req: AuthenticationRequest, res: Response) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

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

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof phone !== "string" ||
            !phone.trim() ||
            latitude === undefined ||
            latitude === "" ||
            longitude === undefined ||
            longitude === "" ||
            !Number.isFinite(Number(latitude)) ||
            !Number.isFinite(Number(longitude)) ||
            typeof formattedAddress !== "string" ||
            !formattedAddress.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid restaurant details and location.",
            });
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (
            lat < -90 ||
            lat > 90 ||
            lng < -180 ||
            lng > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid latitude or longitude.",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Restaurant image is required.",
            });
        }

        const imageUrl =
            `${req.protocol}://${req.get("host")}/uploads/restaurants/${req.file.filename}`;

        const restaurant = await Restaurant.create({
            name: name.trim(),
            description:
                typeof description === "string" ? description.trim() : "",
            phone: phone.trim(),
            image: imageUrl,
            ownerId: user._id,
            autoLocation: {
                type: "Point",
                coordinates: [lng, lat],
                formattedAddress: formattedAddress.trim(),
            },
            isVerified: false,
            isOpen: false,
        });

        return res.status(201).json({
            success: true,
            message: "Restaurant created successfully.",
            restaurant,
        });
    }
);

// --------------------------------------------------
// Fetch seller's restaurant
// GET /api/restaurant/
// --------------------------------------------------

export const fetchRestaurant = TryCatch(
    async (req: AuthenticationRequest, res: Response) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
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
    }
);

// --------------------------------------------------
// Toggle restaurant open/closed
// PATCH /api/restaurant/toggle-open
// --------------------------------------------------

export const toggleRestaurantStatus = TryCatch(
    async (req: AuthenticationRequest, res: Response) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
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

        restaurant.isOpen = !restaurant.isOpen;
        await restaurant.save();

        return res.status(200).json({
            success: true,
            message: restaurant.isOpen
                ? "Restaurant is now open."
                : "Restaurant is now closed.",
            restaurant,
        });
    }
);

// --------------------------------------------------
// Edit restaurant
// PATCH /api/restaurant/edit
// --------------------------------------------------

export const editRestaurant = TryCatch(
    async (req: AuthenticationRequest, res: Response) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        const { name, description } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Restaurant name is required.",
            });
        }

        const restaurant = await Restaurant.findOneAndUpdate(
            { ownerId: user._id },
            {
                name: name.trim(),
                description:
                    typeof description === "string"
                        ? description.trim()
                        : "",
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Restaurant updated successfully.",
            restaurant,
        });
    }
);

// --------------------------------------------------
// Fetch all verified restaurants
// GET /api/restaurant/all?page=1&limit=10
// --------------------------------------------------

export const fetchAllRestaurants = TryCatch(
    async (req: Request, res: Response) => {
        const { page, limit, skip } = getPagination(req);
        const filter = { isVerified: true };

        const [restaurants, total] = await Promise.all([
            Restaurant.find(filter)
                .select("-__v")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Restaurant.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Restaurants fetched successfully.",
            restaurants,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
);

// --------------------------------------------------
// Fetch a verified restaurant by ID
// GET /api/restaurant/:id
// --------------------------------------------------

export const fetchRestaurantById = TryCatch(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({
                success: false,
                message: "Invalid restaurant ID.",
            });
        }

        const restaurant = await Restaurant.findOne({
            _id: id,
            isVerified: true,
        }).select("-__v");

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
    }
);

// --------------------------------------------------
// Search verified restaurants by name
// GET /api/restaurant/search?name=pizza&page=1&limit=10
// --------------------------------------------------

export const searchRestaurants = TryCatch(
    async (req: Request, res: Response) => {
        const { name } = req.query;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            name.trim().length > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide a search name between 1 and 100 characters.",
            });
        }

        const { page, limit, skip } = getPagination(req);

        const filter = {
            isVerified: true,
            name: {
                $regex: escapeRegex(name.trim()),
                $options: "i",
            },
        };

        const [restaurants, total] = await Promise.all([
            Restaurant.find(filter)
                .select("-__v")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Restaurant.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Restaurant search completed successfully.",
            restaurants,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
);
