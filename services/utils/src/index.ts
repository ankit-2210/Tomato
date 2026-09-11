import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import uploadRoutes from "./routes/cloudinary.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({
    limit: "10mb",
}));

app.use(express.urlencoded({
    limit: "10mb",
    extended: true,
}));

const {
    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_SECRET_KEY,
} = process.env;

if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_SECRET_KEY) {
    throw new Error(
        "Missing Cloudinary environment variables"
    );
}

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_SECRET_KEY,
    secure: true,
});

console.log("Cloudinary config:");
console.log("CLOUD_NAME:", CLOUD_NAME);
console.log(
    "CLOUD_API_KEY:",
    CLOUD_API_KEY ? "FOUND" : "MISSING"
);
console.log(
    "CLOUD_SECRET_KEY:",
    CLOUD_SECRET_KEY ? "FOUND" : "MISSING"
);

// Test Cloudinary connection
const testCloudinary = async () => {
    try {
        const result = await cloudinary.api.ping();

        console.log(
            "Cloudinary connection successful:",
            result
        );
    } catch (error) {
        console.error(
            "Cloudinary connection failed:",
            error
        );
    }
};

testCloudinary();

app.use("/api", uploadRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(
        `Utils service is running on port ${PORT}`
    );
});