import User from "../model/User.js";
import jwt from "jsonwebtoken";
import TryCatch from "../middleware/trycatch.js";
export const loginUser = TryCatch(async (req, res) => {
    const { email, name, image } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET not defined");
    }
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            name, email, image
        });
    }
    const token = jwt.sign({ user }, secret, {
        expiresIn: "15d"
    });
    res.status(200).json({
        message: "Login Success",
        token,
        user,
    });
});
