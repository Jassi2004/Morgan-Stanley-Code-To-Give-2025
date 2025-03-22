import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/student.model.js"; 
import { Employee } from "../models/employee.model.js"; 
import { AdminNotification } from "../models/adminNotification.model.js"; 

// Controller to create a notification for student registration
export const registerStudent = asyncHandler(async (req, res) => {
    const { studentId } = req.body;

    // Create a notification for the admin
    const notification = new AdminNotification({
        studentId: studentId,
        message: `Student with ID ${studentId} wants to register.`,
    });
    await notification.save();

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
    const notification = new AdminNotification({
        employeId: employeeId,
        message: `Employee with ID ${employeeId} wants to register.`,
    });
    await notification.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            { notification },
            "Registration request sent to admin for approval."
        )
    );
});


export const approveRegistration = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
  

    if (!notificationId) {
      throw new ApiError(400, "Notification ID is required.");
    }
  

    const notification = await AdminNotification.findById(notificationId);
    if (!notification) {
      throw new ApiError(404, "Notification not found.");
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

    await AdminNotification.findByIdAndDelete(notificationId);
  

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Registration approved successfully."
      )
    );
  });