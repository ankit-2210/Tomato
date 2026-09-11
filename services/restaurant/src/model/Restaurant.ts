import mongoose, { Document, Schema } from "mongoose";

export interface IRestaurant extends Document {
    name: string;
    description?: string;
    image: string;
    ownerId: mongoose.Types.ObjectId;
    phone: number;
    isVerified: boolean;

    autoLocation: {
        type: "Point",
        coordinates: [number, number];  // [longitude, latitude]
        formattedAddress: string;
    };

    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        required: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    phone: {
        type: Number,
        required: true,
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
        },
        coordinates: {
            type: [Number],
            required: true,
        },
        formattedAddress: {
            type: String,
            default: "",
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

restaurantSchema.index({
    autoLocation: "2dsphere",
});

const Restaurant = mongoose.model<IRestaurant>(
    "Restaurant",
    restaurantSchema
);

export default Restaurant;


