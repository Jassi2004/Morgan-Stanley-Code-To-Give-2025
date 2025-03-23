import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { Student } from "../models/students.model.js";
import { Employee } from "../models/employee.model.js";
import { Feedback } from "../models/feedback.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * @desc    Send feedback from a student to an educator
 * @route   POST /api/feedback/send
 * @access  Public
 */
export const sendFeedback = asyncHandler(async (req, res) => {
    const { studentId, educatorId, content, rating } = req.body;
  
    console.log("Incoming feedback:", { studentId, educatorId, content, rating });
  
    if (!studentId || !educatorId || !content) {
        console.log("Missing required fields");
        throw new ApiError(400, "Student ID, Educator ID, and content are required");
    }
  
    const student = await Student.findById(studentId);
    console.log("Student data:", student);
  
    if (!student) {        
        console.log("Student not found:", studentId);
        throw new ApiError(404, "Student not found");
    }
  
    const educator = await Employee.findById(educatorId);
    console.log("Educator data:", educator);
  
    if (!educator) {
        console.log("Educator not found:", educatorId);
        throw new ApiError(404, "Educator not found");
    }

    // Ensure student.educator is initialized as an array
    // if (!student.educator) {
    //     student.educator = [];
    //     await student.save();
    // }
  
    // Convert educatorId to ObjectId for comparison
    const educatorObjectId = new mongoose.Types.ObjectId(educatorId.toString());

    // if (!student.educator.some(id => id.equals(educatorObjectId))) {
    //     console.log("Unauthorized feedback attempt by student:", studentId);
    //     throw new ApiError(403, "You can only send feedback to your assigned educators");
    // }
  
    const feedback = await Feedback.create({ 
        senderId: studentId, 
        receiverId: educatorId, 
        content,
        rating: rating || 5 // Default rating if not provided
    });
  
    console.log("Feedback sent successfully:", feedback._id);
    return res.status(201).json(new ApiResponse(201, feedback, "Feedback sent successfully"));
});

/**
 * @desc    Get feedback sent by a student
 * @route   GET /api/feedback/sent/:studentId
 * @access  Public
 */
export const getSentFeedbacks = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  console.log("Fetching sent feedbacks for student:", studentId);
  const feedbacks = await Feedback.find({ senderId: studentId })
    .populate("receiverId", "name")
    .sort({ createdAt: -1 }); // Sort by newest first

  if (!feedbacks.length) {
    console.log("No sent feedbacks found for student:", studentId);
    throw new ApiError(404, "No sent feedbacks found");
  }

  return res.status(200).json(new ApiResponse(200, feedbacks, "Sent feedbacks retrieved successfully"));
});

/**
 * @desc    Get feedback received by an educator
 * @route   GET /api/feedback/received/:educatorId
 * @access  Public
 */
export const getReceivedFeedbacks = asyncHandler(async (req, res) => {
  const { educatorId, studentId } = req.params;

  console.log("Fetching feedbacks sent by educator:", educatorId, "to student:", studentId);
  
  const feedbacks = await Feedback.find({ senderId: educatorId, receiverId: studentId })
    .populate("receiverId", "firstName lastName") // Get student details
    .sort({ createdAt: -1 }); // Sort by newest first

  if (!feedbacks.length) {
    console.log("No feedbacks found from educator", educatorId, "to student", studentId);
    throw new ApiError(404, "No feedbacks found for this educator-student pair");
  }

  return res.status(200).json(new ApiResponse(200, feedbacks, "Sent feedbacks retrieved successfully"));
});

