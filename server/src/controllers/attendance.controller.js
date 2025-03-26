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

        // Find the student first to get their _id
        const student = await Student.findOne({ StudentId: studentId });
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        // Fetch attendance records using the student's _id
        const attendanceRecords = await attendance.findOne({ studentId: student._id });
        console.log("AttendanceRecords : ", attendanceRecords);

        if (!attendanceRecords) {
            return res.status(404).json(
                new ApiResponse(404, [], "No attendance records found for this student")
            );
        }

        // Check if any of the records have reports
        const hasReports = attendanceRecords.some(record => record.report && record.report.length > 0);
        
        if (!hasReports) {
            return res.status(404).json(
                new ApiResponse(404, [], "No monthly reports found for this student")
            );
        }

        // Extract all reports from all attendance records
        const allReports = attendanceRecords.flatMap(record => record.report);

        return res.status(200).json(
            new ApiResponse(200, allReports, "Successfully fetched monthly attendance reports")
        );

    } catch (err) {
        console.error(`Error while fetching attendance reports: ${err}`);
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
        console.log("Attendance records : ", attendanceRecords);

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
            throw new ApiError(400, "Please upload an Excel file");
        }

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (sheetData.length === 0) {
            return res.status(400).json(new ApiResponse(400, [], "Excel file is empty or invalid format"));
        }

        for (const row of sheetData) {
            const { StudentId, EducatorId, Month, ...days } = row;

            const statusArray = Object.values(days).map(value => {
                const val = String(value).trim();
                return ["P", "A", "$"].includes(val) ? val : "$";
            });

            // Find the student's existing attendance record
            let attendanceRecord = await attendance.findOne({ studentId: StudentId });

            if (attendanceRecord) {
                // Check if the month already exists
                const existingMonthIndex = attendanceRecord.report.findIndex(r => r.month === Month);

                if (existingMonthIndex !== -1) {
                    // Update the existing month's status
                    attendanceRecord.report[existingMonthIndex].status = statusArray;
                } else {
                    // Add a new month entry
                    attendanceRecord.report.push({ month: Month, status: statusArray });
                }
            } else {
                // If no record exists, create a new one
                attendanceRecord = new attendance({
                    studentId: StudentId,
                    educatorId: EducatorId,
                    report: [{ month: Month, status: statusArray }],
                });
            }

            // Recalculate and update attendance percentage
            attendanceRecord.attendancePercentage = calculateAttendancePercentage(attendanceRecord.report);
            await attendanceRecord.save();
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return res.status(201).json(new ApiResponse(201, [], "Successfully uploaded attendance records"));

    } catch (err) {
        console.error(`Error while uploading attendance from Excel: ${err}`);
        throw new ApiError(400, "Error occurred while uploading the data from Excel");
    }
});








export { 
    fetchMonthlyStudentAttendanceReports,
    uploadAttendanceFromExcel,
    getAttendanceByStudentId
}