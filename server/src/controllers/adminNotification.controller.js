import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/students.model.js";
import { Employee } from "../models/employee.model.js";
import { AdminNotification } from "../models/adminNotification.model.js";

// Get all pending notifications
export const getPendingNotifications = asyncHandler(async (req, res) => {
    console.log('Fetching pending notifications...');
    
    try {
        const notifications = await AdminNotification.find({ status: 'PENDING' })
            .populate('studentId', 'firstName lastName email')
            .populate('employeId', 'firstName lastName email')
            .sort('-createdAt');
        
        console.log('Found notifications:', notifications);

        if (!notifications || notifications.length === 0) {
            console.log('No pending notifications found');
            return res.status(200).json(
                new ApiResponse(200, { notifications: [] }, "No pending notifications found")
            );
        }

        console.log('Sending notifications response');
        return res.status(200).json(
            new ApiResponse(200, { notifications }, "Pending notifications fetched successfully")
        );
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw new ApiError(500, "Failed to fetch pending notifications.");
    }
});

// Controller to create a notification for student registration
export const registerStudent = asyncHandler(async (req, res) => {
    const { studentId } = req.body;

    try {
        console.log('Creating notification for student:', studentId);

        const notification = await AdminNotification.create({
            studentId,
            message: `New student registration request`,
            type: 'STUDENT_REGISTRATION',
        });

        console.log('Notification created successfully:', notification);

        return res.status(201).json(
            new ApiResponse(201, { notification }, "Registration request sent to admin for approval.")
        );
    } catch (error) {
        console.error('Error creating student notification:', error);
        throw new ApiError(500, "Failed to create student notification.");
    }
});

// Controller to create a notification for employee registration
export const registerEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.body;

    try {
        console.log('Creating notification for employee:', employeeId);

        const notification = await AdminNotification.create({
            employeId: employeeId,
            message: `New employee registration request`,
            type: 'EMPLOYEE_REGISTRATION',
        });

        console.log('Notification created successfully:', notification);

        return res.status(201).json(
            new ApiResponse(201, { notification }, "Registration request sent to admin for approval.")
        );
    } catch (error) {
        console.error('Error creating employee notification:', error);
        throw new ApiError(500, "Failed to create employee notification.");
    }
});

// Approve registration
export const approveRegistration = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    try {
        console.log('Approving registration for notification:', notificationId);

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

        console.log('Registration approved successfully:', notification);

        return res.status(200).json(
            new ApiResponse(200, { notification }, "Registration approved successfully.")
        );
    } catch (error) {
        console.error('Error approving registration:', error);
        throw new ApiError(500, "Failed to approve registration.");
    }
});

// Reject registration
export const rejectRegistration = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const { reason } = req.body;

    try {
        console.log('Rejecting registration for notification:', notificationId);

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

        console.log('Registration rejected successfully:', notification);

        return res.status(200).json(
            new ApiResponse(200, { notification }, "Registration rejected successfully.")
        );
    } catch (error) {
        console.error('Error rejecting registration:', error);
        throw new ApiError(500, "Failed to reject registration.");
    }
});