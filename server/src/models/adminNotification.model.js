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
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    type: {
        type: String,
        enum: ['STUDENT_REGISTRATION', 'EMPLOYEE_REGISTRATION'],
        required: true
    }
}, {
    timestamps: true
});

export const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);