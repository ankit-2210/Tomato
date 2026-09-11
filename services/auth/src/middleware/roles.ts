import { Response, NextFunction } from "express";
import { AuthenticationRequest } from "./auth.js";

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthenticationRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden - insufficient permissions",
            });
        }
        next();
    }
}

