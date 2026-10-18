import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "tomato"
        });
        console.log("Connected to database:", mongoose.connection.name);
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Database connection is not available");
        }
        const collection = db.collection("restaurants");
        const indexes = await collection.indexes();
        console.log("Current restaurant indexes:", indexes);
        const uniqueOwnerIndex = indexes.find((index) => index.key?.ownerId === 1 &&
            index.unique === true);
        if (uniqueOwnerIndex?.name) {
            await collection.dropIndex(uniqueOwnerIndex.name);
            console.log("Removed unique ownerId index:", uniqueOwnerIndex.name);
        }
        else {
            console.log("No unique ownerId index found.");
        }
    }
    catch (error) {
        console.error("MongoDB connection/index error:", error);
        throw error;
    }
};
export default connectDB;
