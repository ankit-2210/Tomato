import express from "express";
import { v2 as cloudinary } from "cloudinary";
const router = express.Router();
router.post("/upload", async (req, res) => {
    try {
        console.log("========== UTILS UPLOAD ==========");
        const { buffer } = req.body;
        if (!buffer) {
            return res.status(400).json({
                success: false,
                message: "Image buffer is required.",
            });
        }
        console.log("Buffer exists:", !!buffer);
        console.log("Buffer type:", typeof buffer);
        console.log("Buffer length:", buffer.length);
        console.log("Buffer prefix:", buffer.substring(0, 50));
        console.log("Starting Cloudinary upload...");
        const result = await cloudinary.uploader.upload(buffer, {
            // folder: "tomato/restaurants",
            resource_type: "image",
        });
        console.log("Cloudinary upload successful:");
        console.log("Public ID:", result.public_id);
        console.log("URL:", result.secure_url);
        return res.status(200).json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        });
    }
    catch (error) {
        console.error("========== CLOUDINARY ERROR ==========");
        if (error instanceof Error) {
            console.error("Message:", error.message);
        }
        if (typeof error === "object" &&
            error !== null &&
            "http_code" in error) {
            console.error("HTTP Code:", error.http_code);
        }
        console.error("Full error:", error);
        console.error("======================================");
        return res.status(500).json({
            success: false,
            message: "Cloudinary upload failed.",
        });
    }
});
export default router;
