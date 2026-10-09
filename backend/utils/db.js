import mongoose from "mongoose";
import seedDemo from "./seedDemo.js";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully");
        await seedDemo();
    } catch (error) {
        console.log("mongodb connection failed");
        console.log(error);
    }
}

export default connectDB;