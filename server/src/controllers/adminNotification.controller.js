import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/students.model.js"; 
import { Employee } from "../models/employee.model.js"; 
import { AdminNotification } from "../models/adminNotification.model.js"; 

// Get all pending notifications
export const getPendingNotifications = asyncHandler(async (req, res) => {
    console.log('Fetching pending notifications...'); // Debug log
    
    const notifications = await AdminNotification.find({ status: 'PENDING' })
        .populate('studentId', 'firstName lastName email')
        .populate('employeId', 'firstName lastName email')
        .sort('-createdAt');
    
    console.log('Found notifications:', notifications); // Debug log
    
    // Check if notifications were found
    if (!notifications || notifications.length === 0) {
        console.log('No pending notifications found'); // Debug log
        return res.status(200).json(
            new ApiResponse(
                200,
                { notifications: [] },
                "No pending notifications found"
            )
        );
    }

    console.log('Sending notifications response'); // Debug log
    return res.status(200).json(
        new ApiResponse(
            200,
            { notifications },
            "Pending notifications fetched successfully"
        )
    );
});

// Controller to create a notification for student registration
export const registerStudent = asyncHandler(async (req, res) => {
    const { studentId } = req.body;

    // Create a notification for the admin
    const notification = await AdminNotification.create({
        studentId,
        message: `New student registration request`,
        type: 'STUDENT_REGISTRATION'
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            { notification },
            "Registration request sent to admin for approval."
        )
    );
});

// Controller to create a notification for employee registration
export const registerEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.body;

    // Create a notification for the admin
    const notification = await AdminNotification.create({
        employeId: employeeId,
        message: `New employee registration request`,
        type: 'EMPLOYEE_REGISTRATION'
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            { notification },
            "Registration request sent to admin for approval."
        )
    );
});

// Approve registration
export const approveRegistration = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    if (!notificationId) {
        throw new ApiError(400, "Notification ID is required.");
    }

    const notification = await AdminNotification.findById(notificationId);
    if (!notification) {
        throw new ApiError(404, "Notification not found.");
    }

    if (notification.status !== 'PENDING') {
        throw new ApiError(400, "This registration has already been processed.");
    }

    if (notification.studentId) {
        const student = await Student.findByIdAndUpdate(
            notification.studentId,
            { isApproved: true },
            { new: true }
        );
        if (!student) {
            throw new ApiError(404, "Student not found.");
        }
    } else if (notification.employeId) {
        const employee = await Employee.findByIdAndUpdate(
            notification.employeId,
            { isApproved: true },
            { new: true }
        );
        if (!employee) {
            throw new ApiError(404, "Employee not found.");
        }
    } else {
        throw new ApiError(400, "Notification does not contain a valid student or employee reference.");
    }

    notification.status = 'APPROVED';
    await notification.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { notification },
            "Registration approved successfully."
        )
    );
});

// Reject registration
export const rejectRegistration = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const { reason } = req.body;

    if (!notificationId) {
        throw new ApiError(400, "Notification ID is required.");
    }

    const notification = await AdminNotification.findById(notificationId);
    if (!notification) {
        throw new ApiError(404, "Notification not found.");
    }

    if (notification.status !== 'PENDING') {
        throw new ApiError(400, "This registration has already been processed.");
    }

    notification.status = 'REJECTED';
    notification.message = `Registration rejected. Reason: ${reason || 'Not specified'}`;
    await notification.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { notification },
            "Registration rejected successfully."
        )
    );
}); 