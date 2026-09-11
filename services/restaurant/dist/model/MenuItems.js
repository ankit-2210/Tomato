import mongoose, { Schema } from "mongoose";
const menuItemsSchema = new Schema({
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    isAvailable: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true,
});
const MenuItem = mongoose.model("MenuItem", menuItemsSchema);
export default MenuItem;
