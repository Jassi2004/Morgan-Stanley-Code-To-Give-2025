import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/students.model.js";
import { Employee } from "../models/employee.model.js";
import { AdminNotification } from "../models/adminNotification.model.js";
import  sendEmail  from "../utils/sendEmail.js";


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
            await Student.findByIdAndUpdate(notification.studentId, { 
                approval: {
                    status: 'Approved',
                }
            }, { new: true });
        } else if (notification.employeId) {
            await Employee.findByIdAndUpdate(notification.employeId, { 
                approval: {
                    status: 'Approved',
                }
            }, { new: true });
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

export const rejectRegistration = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const { reason } = req.body;

    try {
        if (!notificationId) {
            throw new ApiError(400, "Notification ID is required");
        }

        if (!reason) {
            throw new ApiError(400, "Rejection reason is required");
        }

        const notification = await AdminNotification.findById(notificationId)
            .populate('studentId')
            .populate('employeId');
        
        if (!notification) {
            throw new ApiError(404, "Notification not found");
        }

        if (notification.status !== 'PENDING') {
            throw new ApiError(400, "This registration has already been processed");
        }

        // Prepare recipient details
        let recipientEmail;
        let recipientName;
        let recipientType;

        if (notification.studentId) {
            recipientEmail = notification.studentId.email;
            recipientName = `${notification.studentId.firstName} ${notification.studentId.lastName}`;
            recipientType = 'Student';
            
            // Update student status
            await Student.findByIdAndUpdate(
                notification.studentId._id, { 
                    approval: {
                        status: 'Rejected',
                        reason: reason,
                    },
                }
            );
        } else if (notification.employeId) {
            recipientEmail = notification.employeId.email;
            recipientName = `${notification.employeId.firstName} ${notification.employeId.lastName}`;
            recipientType = 'Employee';
            
            // Update employee status
            await Employee.findByIdAndUpdate(
                notification.employeId._id,
                { 
                    approval: {
                        status: 'Rejected',
                        reason: reason
                    }
                }
            );
        }

        // Prepare and send email
        const emailSubject = `Morgan Stanley Code To Give - Registration Status Update`;
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a365d; margin-bottom: 10px;">Registration Status Update</h1>
                    <div style="height: 3px; background-color: #1a365d; width: 100px; margin: 0 auto;"></div>
                </div>

                <p style="color: #2d3748; font-size: 16px;">Dear ${recipientName},</p>
                
                <p style="color: #2d3748; font-size: 16px;">We regret to inform you that your registration as a ${recipientType.toLowerCase()} for Morgan Stanley Code To Give has been rejected.</p>
                
                <div style="background-color: #f7fafc; border-left: 4px solid #e53e3e; padding: 15px; margin: 20px 0;">
                    <p style="color: #2d3748; font-weight: bold; margin-bottom: 8px;">Reason for Rejection:</p>
                    <p style="color: #2d3748; margin: 0;">${reason}</p>
                </div>
                
                <p style="color: #2d3748; font-size: 16px;">If you believe this was done in error or have any questions, please don't hesitate to contact our support team.</p>
                
                <div style="margin-top: 30px;">
                    <p style="color: #2d3748; margin-bottom: 5px;">Best regards,</p>
                    <p style="color: #2d3748; font-weight: bold; margin-top: 0;">Morgan Stanley Code To Give Team</p>
                </div>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #718096; font-size: 12px; text-align: center;">This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        `;

        // Send the email
        try {
            await sendEmail(recipientEmail, emailSubject, emailHtml);
            console.log(`Rejection email sent to ${recipientEmail}`);
        } catch (emailError) {
            console.error('Failed to send rejection email:', emailError);
            // Continue with the rejection process even if email fails
        }

        // Update notification status
        notification.status = 'REJECTED';
        notification.message = `Registration rejected. Reason: ${reason}`;
        await notification.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                { notification },
                "Registration rejected and notification email sent successfully"
            )
        );

    } catch (error) {
        console.error('Rejection process error:', error);
        throw new ApiError(
            error.statusCode || 500,
            error.message || "Failed to process rejection"
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