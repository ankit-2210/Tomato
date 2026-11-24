import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICartItem {
    menuItemId: Types.ObjectId;
    name: string;
    image?: string | undefined;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface ICart extends Document {
    userId: Types.ObjectId;
    restaurantId: Types.ObjectId;

    items: ICartItem[];

    totalItems: number;
    subtotal: number;

    createdAt: Date;
    updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
    menuItemId: {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    image: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 20,
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0,
    }
}, {
    _id: false,
}
);

const cartSchema = new Schema<ICart>(
    {
        // One active cart per customer
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // A cart can contain items from only one restaurant
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
            index: true,
        },

        items: {
            type: [cartItemSchema],
            default: [],
        },

        totalItems: {
            type: Number,
            default: 0,
            min: 0,
        },

        subtotal: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * A customer has only one active cart.
 *
 * This prevents:
 * user A -> restaurant A cart
 * user A -> restaurant B cart
 *
 * from existing simultaneously.
 */

// Exactly one active cart per user
cartSchema.index(
    { userId: 1 },
    { unique: true }
);

// Useful for restaurant-related queries
cartSchema.index({
    restaurantId: 1,
    updatedAt: -1,
});

const Cart = mongoose.model<ICart>(
    "Cart", 
    cartSchema
);

export default Cart;




