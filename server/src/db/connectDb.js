import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

/**
 * Asynchronously connects to the MongoDB database using the connection URI from environment variables.
 * Logs a success message with the host name if the connection is successful.
 * Logs an error message and exits the process with status code 1 if the connection fails.
 *
 * @async
 * @function connectDB
 * @throws Will throw an error if the connection to MongoDB fails.
 */
const connectDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    }catch(err){
        console.error(`MongoDB connection error: ${err}`);
        process.exit(1);
    }
}

export default connectDB;

