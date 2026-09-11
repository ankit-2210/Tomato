import jwt from "jsonwebtoken";
import axios from "axios";
import TryCatch from "./trycatch.js";
export const isAuth = TryCatch(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Token missing",
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please Login - Token missing",
        });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET not defined");
    }
    let decodedValue;
    try {
        decodedValue = jwt.verify(token, secret);
    }
    catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
    console.log("Decoded token:", decodedValue);
    if (!decodedValue.id) {
        return res.status(401).json({
            success: false,
            message: "Invalid token - User ID missing",
        });
    }
    try {
        const { data } = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/user/${decodedValue.id}`, {
            headers: {
                Authorization: authHeader,
            },
        });
        if (!data?.user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        req.user = data.user;
        console.log("Authenticated user:", req.user);
        next();
    }
    catch (error) {
        console.error("Auth service error:", error);
        return res.status(401).json({
            success: false,
            message: "Unable to authenticate user",
        });
    }
});
export const isSeller = async (req, res, next) => {
    const user = req.user;
    console.log("Checking seller role for user:", user?.role);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - User not found",
        });
    }
    if (user.role !== "seller") {
        return res.status(403).json({
            success: false,
            message: "Forbidden - Seller access required",
        });
    }
    next();
};
