import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { attendance } from "../models/attendance.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import fs from "fs";
import xlsx from "xlsx";
import { Student } from "../models/students.model.js";


const fetchMonthlyStudentAttendanceReports = asyncHandler(async (req, res) => {
    try {
        const { studentId } = req.body;

        if (!studentId) {
            throw new ApiError(400, "Student ID is required");
        }

        // Find all attendance records for the given student
        const attendanceRecords = await attendance.find({ studentId });

        if (!attendanceRecords.length) {
            return res.status(404).json(
                new ApiResponse(404, [], "No attendance records found for this student")
            );
        }

        // Extract the monthly attendance reports
        const monthlyReports = attendanceRecords.map(record => ({
            month: record.report[0]?.month, // Get the month
            status: record.report[0]?.status || [], // Get attendance status array
            attendancePercentage: record.attendancePercentage, // Attendance percentage
        }));

        return res.status(200).json(
            new ApiResponse(200, monthlyReports, "Successfully fetched monthly attendance reports")
        );

    } catch (err) {
        console.error(`Error occurred while fetching monthly student attendance reports: ${err}`);
        throw new ApiError(400, "Error occurred while fetching monthly student reports");
    }
});

function calculateAttendancePercentage(report){
    let totalDays = 0;
    let presentDays = 0;

    report.forEach((ele) => {
        ele.status.forEach((day) => {
            if(day !== "$") totalDays++;
            if(day === "P") presentDays++;
        });
    });

    return totalDays > 0 ? ( presentDays / totalDays ) * 100 : 0;
}


const getAttendanceByStudentId = asyncHandler(async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            throw new ApiError(400, "Please provide student ID");
        }

        // Fetch student by ID
        const student = await Student.findOne({StudentId : studentId});
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        // Fetch attendance records for the student
        const attendanceRecords = await attendance.find({ studentId : student?._id });

        // Check if attendance records exist
        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json(
                new ApiResponse(404, [], "No attendance records found for this student")
            );
        }

        return res.status(200).json(
            new ApiResponse(200, attendanceRecords, "Successfully fetched attendance records")
        );

    } catch (err) {
        console.error(`Error occurred while getting attendance by studentId: ${err}`);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
});


const uploadAttendanceFromExcel = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            throw new ApiError(400, "Please upload an excel file");
        }

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log("Parsed Sheet Data:", sheetData); // Debugging

        if (sheetData.length === 0) {
            return res.status(400).json(
                new ApiResponse(400, [], "Excel file is empty or invalid format")
            );
        }

        let attendanceRecords = sheetData.map((row) => {
            let { StudentId, EducatorId, Month, ...days } = row;
            
            const statusArray = Object.values(days).map(value => {
                const val = String(value).trim(); // Ensure it's a string
                return ["P", "A", "$"].includes(val) ? val : "$"; // Default to "$" if invalid
            });

            return {
                studentId: new mongoose.Types.ObjectId(StudentId), // Convert to ObjectId
                educatorId: new mongoose.Types.ObjectId(EducatorId), // Convert to ObjectId
                report: [{ month: Month, status: statusArray }],
                attendancePercentage: calculateAttendancePercentage([{ month: Month, status: statusArray }]), // ✅ Calculate before saving
            };
        });

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`File ${filePath} successfully deleted..`);
        }

        await attendance.insertMany(attendanceRecords);

        return res.status(201).json(
            new ApiResponse(201, attendanceRecords, "Successfully uploaded attendance records")
        );

    } catch (err) {
        console.error(`Error occurred while uploading attendance from excel: ${err}`);
        throw new ApiError(400, "Error occurred while uploading the data from excel");
    }
});



export { 
    fetchMonthlyStudentAttendanceReports,
    uploadAttendanceFromExcel,
    getAttendanceByStudentId
}