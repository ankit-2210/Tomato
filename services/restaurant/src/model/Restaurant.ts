
import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";

export interface IRestaurant extends Document {
    name: string;
    description?: string;
    image: string;
    ownerId: mongoose.Types.ObjectId;
    phone: string;
    isVerified: boolean;

    autoLocation: {
        type: "Point";
        coordinates: [number, number]; // [longitude, latitude]
        formattedAddress: string;
    };

    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        description: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000,
        },

        image: {
            type: String,
            required: true,
            trim: true,
        },

        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        autoLocation: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
                required: true,
            },

            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: (coordinates: number[]) => {
                        if (coordinates.length !== 2) {
                            return false;
                        }

                        const [longitude, latitude] = coordinates;

                        return (
                            longitude !== undefined &&
                            latitude !== undefined &&
                            Number.isFinite(longitude) &&
                            Number.isFinite(latitude) &&
                            longitude >= -180 &&
                            longitude <= 180 &&
                            latitude >= -90 &&
                            latitude <= 90
                        );
                    },
                    message:
                        "Coordinates must contain valid [longitude, latitude] values.",
                },
            },

            formattedAddress: {
                type: String,
                required: true,
                trim: true,
            },
        },

        isOpen: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Geospatial index for nearby restaurant searches
restaurantSchema.index({
    autoLocation: "2dsphere",
});

const Restaurant = mongoose.model<IRestaurant>(
    "Restaurant",
    restaurantSchema
);

export default Restaurant;
