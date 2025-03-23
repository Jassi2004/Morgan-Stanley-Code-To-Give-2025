import { app } from "./app.js";
import connectDB from "./db/connectDb.js";
import dotenv from "dotenv";
import { scheduleBirthdayWish } from "./utils/scheduelBirthdayWish.js";

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        console.log(`MongoDB connection successfully`);
        scheduleBirthdayWish();
        app.listen(PORT, () => {
            console.log(`Server is listening at PORT : ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(`MongoDb connection failed : ${err}`);
    })

