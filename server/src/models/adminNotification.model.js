import mongoose from "mongoose";


const adminNotificationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    employeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    message: {
        type: String,
    }
})

export const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);