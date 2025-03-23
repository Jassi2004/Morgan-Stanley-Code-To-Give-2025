import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/students.model.js";
import { Employee } from "../models/employee.model.js";
import { AdminNotification } from "../models/adminNotification.model.js";



// Get all pending notifications
export const getPendingNotifications = asyncHandler(async (req, res) => {
    try {
        const notifications = await AdminNotification.find({ status: 'PENDING' })
            .populate('studentId', '-password -refreshToken')
            .populate('employeId', '-password -refreshToken')
            .sort('-createdAt')
            .lean();

        return res.status(200).json({
            success: true,
            data: {
                notifications
            },
            message: "Pending notifications fetched successfully"
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw new ApiError(500, "Failed to fetch pending notifications.");
    }
});

// Controller to create a notification for student registration
export const registerStudent = asyncHandler(async (req, res) => {
    const { studentId } = req.body;

    try {
        const notification = await AdminNotification.create({
            studentId,
            message: `New student registration request.`,
            type: "STUDENT_REGISTRATION",
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                { notification },
                "Registration request sent to admin for approval."
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to create student notification.");
    }
});

// Controller to create a notification for employee registration
export const registerEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.body;

    try {
        const notification = await AdminNotification.create({
            employeId: employeeId,
            message: `New employee registration request.`,
            type: "EMPLOYEE_REGISTRATION",
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                { notification },
                "Registration request sent to admin for approval."
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to create employee notification.");
    }
});

// Approve registration
export const approveRegistration = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await AdminNotification.findById(notificationId);
        if (!notification) {
            throw new ApiError(404, "Notification not found.");
        }

        if (notification.status !== "PENDING") {
            throw new ApiError(400, "This registration has already been processed.");
        }

        if (notification.studentId) {
            await Student.findByIdAndUpdate(notification.studentId, { isApproved: true }, { new: true });
        } else if (notification.employeId) {
            await Employee.findByIdAndUpdate(notification.employeId, { isApproved: true }, { new: true });
        } else {
            throw new ApiError(400, "Notification does not contain a valid student or employee reference.");
        }

        notification.status = "APPROVED";
        await notification.save();

        return res.status(200).json(
            new ApiResponse(200, { notification }, "Registration approved successfully.")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to approve registration.");
    }
});

// Reject registration
export const rejectRegistration = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const { reason } = req.body;

    try {
        console.log('Processing rejection:', { notificationId, reason }); // Debug log

        if (!notificationId) {
            throw new ApiError(400, "Notification ID is required");
        }

        if (!reason) {
            throw new ApiError(400, "Rejection reason is required");
        }

        const notification = await AdminNotification.findById(notificationId);
        
        if (!notification) {
            throw new ApiError(404, "Notification not found");
        }

        if (notification.status !== 'PENDING') {
            throw new ApiError(400, "This registration has already been processed");
        }

        // Update notification status
        notification.status = 'REJECTED';
        notification.message = `Registration rejected. Reason: ${reason}`;
        await notification.save();

        // Update the corresponding student or employee status
        if (notification.studentId) {
            await Student.findByIdAndUpdate(
                notification.studentId,
                { 
                    isApproved: false,
                    status: 'Rejected',
                    rejectionReason: reason
                },
                { new: true }
            );
        } else if (notification.employeId) {
            await Employee.findByIdAndUpdate(
                notification.employeId,
                { 
                    isApproved: false,
                    status: 'Rejected',
                    rejectionReason: reason
                },
                { new: true }
            );
        }

        // Send email notification (if you have email service configured)
        // You can add email sending logic here

        return res.status(200).json(
            new ApiResponse(
                200,
                { notification },
                "Registration rejected successfully"
            )
        );
    } catch (error) {
        console.error('Rejection controller error:', error); // Debug log
        throw new ApiError(
            error.statusCode || 500,
            error.message || "Failed to reject registration"
        );
    }
});

// Get details of a specific student or employee
export const getEntityDetails = asyncHandler(async (req, res) => {
    const { id, type } = req.query;

    if (!id || !type) {
        throw new ApiError(400, "Both ID and type are required.");
    }

    try {
        let entityDetails;
        console.log('Fetching details for:', { type, id }); // Debug log

        if (type === "student") {
            entityDetails = await Student.findById(id)
                .select("-password -refreshToken")
                .lean(); // Use lean() for better performance
        } else if (type === "employee") {
            entityDetails = await Employee.findById(id)
                .select("-password -refreshToken")
                .lean(); // Use lean() for better performance
        } else {
            throw new ApiError(400, "Invalid type specified. Use 'student' or 'employee'.");
        }

        if (!entityDetails) {
            throw new ApiError(404, `${type} not found.`);
        }

        console.log('Found entity details:', entityDetails); // Debug log

        return res.status(200).json({
            success: true,
            data: {
                entityDetails
            },
            message: `${type} details fetched successfully.`
        });
    } catch (error) {
        console.error('Error in getEntityDetails:', error); // Debug log
        throw new ApiError(500, `Failed to fetch ${type} details: ${error.message}`);
    }
});