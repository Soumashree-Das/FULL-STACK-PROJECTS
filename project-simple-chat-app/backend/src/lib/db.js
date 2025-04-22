import mongoose, { mongo } from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

export const connectDB = async () => {
    try{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully!:${conn.connection.host}`)
    }catch(e){
        console.log(`connection error :   ${e}`);
        
    }
}
