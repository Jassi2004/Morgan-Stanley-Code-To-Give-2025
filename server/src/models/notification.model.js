import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
    }
}, {timestamps: true});

export const Notification = mongoose.model("Notification", notificationSchema);