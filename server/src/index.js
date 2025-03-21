import { app } from "./app.js";
import connectDB from "./db/connectDb.js";
import dotenv from "dotenv";

dotenv.config({ path : "./.env" });
const PORT = process.env.PORT || 5000;



connectDB()
    .then(() => {
        console.log(`MongoDB connection successfully`);
        app.listen(PORT, () => {
            console.log(`Server is listening at PORT : ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(`MongoDb connection failed : ${err}`);
    })

