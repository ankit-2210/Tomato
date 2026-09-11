import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["customer", "seller", "rider"],
        default: null,
    },
}, {
    timestamps: true,
});
const User = mongoose.model("User", userSchema);
export default User;
