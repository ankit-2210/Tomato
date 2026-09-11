import { Request, Response } from "express";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import TryCatch from "../middleware/trycatch.js";
import { AuthenticationRequest } from "../middleware/auth.js";
import { generateToken } from "../utils/generateToken.js";
import { oauth2client } from "../config/googleConfig.js";
import { google } from "googleapis";

export const loginUser = TryCatch(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ message: "Authorization! Code is required" });
    }

    const googleResponse = await oauth2client.getToken(code);
    console.log(googleResponse);
    oauth2client.setCredentials(googleResponse.tokens);

    const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`);
    console.log("UserResponse:" + userResponse);
    const { email, name, picture } = userResponse.data;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ name, email, image: picture })
    }

    const token = generateToken(user._id.toString());
    return res.status(200).json({
        message: "Login Success",
        token,
        user,
    });
});


const allowedRoles = ["customer", "rider", "seller"] as const;
type Role = (typeof allowedRoles)[number];

export const addUserRole = TryCatch(async (req: AuthenticationRequest, res: Response) => {
    if (!req.user?._id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { role } = req.body as { role: Role };
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            message: "Invalid role"
        });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { role }, { new: true });
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const token = generateToken(user._id.toString());
    return res.status(200).json({
        message: "Role Updated",
        token,
        user,
    });
})


export const myProfile = TryCatch(async (req: AuthenticationRequest, res: Response) => {
    // console.log(req.user);
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.json(req.user);
});


export const getUserById = TryCatch(async (req: Request, res: Response) => {
    const { id } = req.params;

    console.log("Fetching user:", id);

    const user = await User.findById(id).select(
        "_id name email image role"
    );

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    return res.status(200).json({
        success: true,
        user,
    });
});
