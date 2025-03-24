import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { studentReport } from "../models/studentReport.model.js";
import { Student } from "../models/students.model.js";
import { Grade } from "../models/grades.model.js";
import { monthlyReport } from "../models/monthlyReports.model.js";
import { isValidObjectId } from "mongoose";

const generateStudentQuarterlyReport = asyncHandler(async (req, res) => {
    try {
        const {
            studentId,
            programFeedback,
            feedback,
        } = req.body;



        if (!feedback) {
            throw new ApiError(400, "Missing required fields for student report.");
        }


        const student = await Student.findOne({ StudentId : studentId });
        if (!student) {
            throw new ApiError(404, "Student not found.");
        }

        const grades = await Grade.find({ student : student._id}).select("_id");

        const monthlyReports = await monthlyReport.find({ studentDetails : student._id }).select("_id");


        const newReport = new studentReport({
            studentDetails: student._id,
            programFeedback,
            feedback,
            assessmentReport : grades.map(grade => grade._id),
            monthlyReports : monthlyReports.map((report) => report._id),
        });


        await newReport.save();


        const report = await studentReport.findById(newReport._id).populate("studentDetails", "StudentId firstName lastName program primaryDiagnosis guardianDetails.name guardianDetails.relation guardianDetails.contactNumber guardianDetails.parentEmail")
        .populate({
            path : "assessmentReport",
            select : "program marks feedback date assessmentName"
        })
        .populate({
            path : "monthlyReports",
            select : "monthlyScore remarks timeFrame"
        })


        
        res.status(201).json(
            new ApiResponse(
                201,
                report,
                "Student report generated successfully."
            )
        );

    } catch (err) {
        console.error(`Error occurred while generating the student report: ${err}`);
        throw new ApiError(400, "Error occurred while generating the student report.");
    }
});


const generateMonthlyReport = asyncHandler(async (req, res) => {
    try {
        const { studentId, monthlyScore, remarks, timeFrame } = req.body;

        // Validation: Ensure studentId, monthlyScore array, and remarks are provided
        if (!studentId || !Array.isArray(monthlyScore) || monthlyScore.length === 0 || !remarks) {
            throw new ApiError(400, "Invalid or missing required fields.");
        }

        // Validation: Ensure each skill entry has skillName and marks
        for (const skill of monthlyScore) {
            if (!skill.skillName || typeof skill.marks !== "number" || skill.marks < 0 || skill.marks > 5) {
                throw new ApiError(400, "Each skill must have a skillName and a valid marks value between 0 and 5.");
            }
        }

        // Auto-assigns timeframe if not provided
        const currentDate = new Date();
        const month = currentDate.toLocaleString("en-US", { month: "short" });
        const year = currentDate.getFullYear().toString();
        const quarter = `Q${Math.ceil((currentDate.getMonth() + 1) / 3)}`;

        const report = await monthlyReport.create({
            studentDetails: studentId,
            monthlyScore,
            remarks,
            timeFrame: timeFrame || { month, year, quarter }, // Auto-assign timeframe if not provided
        });

        return res.status(201).json(new ApiResponse(201, report, "Student Monthly report successfully generated"));

    } catch (err) {
        console.error(`Error while generating monthly reports: ${err}`);
        throw new ApiError(400, "Error occurred while generating monthly reports.");
    }
});


const fetchStudentReportById = asyncHandler(async(req, res) => {
    try{
        const { studentId } = req.body;

        if(!isValidObjectId(studentId)){
            throw new ApiError(400, "Invalid Student Id");
        }

        const userReport = await studentReport.findOne({ studentDetails : studentId }).populate("studentDetails", "StudentId firstName lastName program primaryDiagnosis guardianDetails.name guardianDetails.relation guardianDetails.contactNumber guardianDetails.parentEmail")
        .populate({
            path : "assessmentReport",
            select : "program marks feedback date assessmentName"
        })
        .populate({
            path : "monthlyReports",
            select : "monthlyScore remarks timeFrame"
        })
        
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                userReport,
                "Student Report fetched successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching student reports by Id : ${err}`);
        throw new ApiError(400, "Error occured while fetching student reports by ID");
    }
})

const fetchAllStudentReports = asyncHandler(async(req, res) => {
    try{
        
        const allReports = await studentReport.find({}).populate("studentDetails", "StudentId firstName lastName program primaryDiagnosis guardianDetails.name guardianDetails.relation guardianDetails.contactNumber guardianDetails.parentEmail")
        .populate({
            path : "assessmentReport",
            select : "program marks feedback date assessmentName"
        })
        .populate({
            path : "monthlyReports",
            select : "monthlyScore remarks timeFrame"
        });

        if(allReports.length == 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    [],
                    "No reports exists yet"
                )
            )
        };
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allReports,
                "All reports fetched successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching all student reports : ${err}`);
        throw new ApiError(400, "Error occurred while fetching all students reports");
    }
})


export { 
    generateStudentQuarterlyReport,
    generateMonthlyReport,
    fetchStudentReportById,
    fetchAllStudentReports
};
