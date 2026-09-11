import express from "express";
import connectDB from "./config/dbconnection.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import restaurantRoutes from "./routes/restaurant.js";
import menuItemRoutes from "./routes/menuItem.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
// Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/menu-item", menuItemRoutes);
const PORT = process.env.PORT || 5001;
const startServer = async () => {
    try {
        await connectDB();
        console.log("Database connected");
        app.listen(PORT, () => {
            console.log(`Restaurant service is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};
startServer();
