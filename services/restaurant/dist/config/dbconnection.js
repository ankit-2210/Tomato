import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "tomato"
        });
        console.log("Connected");
    }
    catch (error) {
        console.log(error);
    }
};
export default connectDB;
