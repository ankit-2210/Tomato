import { Request, Response, RequestHandler, NextFunction } from "express";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../model/User.js";
import TryCatch from "./trycatch.js";

export interface AuthenticationRequest extends Request {
    user?: IUser | null;
}

export const isAuth = TryCatch(async (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Please Login - Token missing",
        });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET not defined");
    }

    const decodedValue = jwt.verify(token, secret) as JwtPayload;
    if (!decodedValue || !decodedValue.id) {
        return res.status(401).json({
            message: "Invalid Token",
        })
    }

    console.log(decodedValue.id);

    const user = await User.findById(decodedValue.id);
    if (!user) {
        return res.status(401).json({
            message: "User not found",
        });
    }

    req.user = user;
    next();
})




