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


        const report = await studentReport.findById(newReport._id).populate("studentDetails", "StudentId", "firstName", "lastName", "contactNumber", "altContactNumber", "program", "primaryDiagnosis", "motherName", "fatherName", "parentEmail")
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

        // Find student by manual ID to get MongoDB ObjectId
        const student = await Student.findOne({ StudentId: studentId });
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        // Auto-assigns timeframe if not provided
        const currentDate = new Date();
        const month = currentDate.toLocaleString("en-US", { month: "short" });
        const year = currentDate.getFullYear().toString();
        const quarter = `Q${Math.ceil((currentDate.getMonth() + 1) / 3)}`;

        const report = await monthlyReport.create({
            studentDetails: student._id, // Use the MongoDB ObjectId instead of manual ID
            monthlyScore,
            remarks,
            timeFrame: timeFrame || { month, year, quarter }, // Auto-assign timeframe if not provided
        });

        // Populate student details in the response
        const populatedReport = await monthlyReport.findById(report._id)
            .populate("studentDetails", "StudentId firstName lastName program");

        return res.status(201).json(
            new ApiResponse(
                201, 
                populatedReport,
                "Student Monthly report successfully generated"
            )
        );

    } catch (err) {
        console.error(`Error while generating monthly reports: ${err}`);
        throw new ApiError(400, "Error occurred while generating monthly reports.");
    }
});


const fetchStudentReportById = asyncHandler(async(req, res) => {
    try{
        const { studentId } = req.body;
        
        if (!studentId) {
            throw new ApiError(400, "Student ID is required");
        }

        // First find the student using manual ID
        const student = await Student.findOne({ StudentId: studentId });
        
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        const userReport = await studentReport.findOne({ studentDetails: student._id })
        .populate("studentDetails", "StudentId firstName lastName program primaryDiagnosis guardianDetails.name guardianDetails.relation guardianDetails.contactNumber guardianDetails.parentEmail")
        .populate({
            path: "assessmentReport",
            select: "program marks feedback date assessmentName"
        })
        .populate({
            path: "monthlyReports",
            select: "monthlyScore remarks timeFrame"
        });

        if (!userReport) {
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "No reports found for this student"
                )
            );
        }
        
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                userReport,
                "Student Report fetched successfully"
            )
        );

    } catch(err) {
        console.error(`Error occurred while fetching student reports by Id: ${err}`);
        throw new ApiError(400, "Error occurred while fetching student reports by ID");
    }
});

const fetchAllStudentReports = asyncHandler(async(req, res) => {
    try{
        const allReports = await studentReport.find()
            .populate({
                path: "studentDetails",
                select: "StudentId firstName lastName contactNumber altContactNumber program primaryDiagnosis motherName fatherName parentEmail"
            })
            .populate({
                path: "assessmentReport",
                select: "program marks feedback date assessmentName"
            })
            .populate({
                path: "monthlyReports",
                select: "monthlyScore remarks timeFrame"
            });

        if(allReports.length === 0){
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

const updateQuarterlyReport = asyncHandler(async (req, res) => {
    try {
        const { studentId, timeFrame } = req.body;

        if (!studentId || !timeFrame || !timeFrame.quarter || !timeFrame.year) {
            throw new ApiError(400, "Missing required fields");
        }

        // Find student by manual ID
        const student = await Student.findOne({ StudentId: studentId });
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        // Get all monthly reports for this quarter
        const monthlyReports = await monthlyReport.find({
            studentDetails: student._id,
            'timeFrame.quarter': timeFrame.quarter,
            'timeFrame.year': timeFrame.year
        });

        if (monthlyReports.length === 0) {
            throw new ApiError(404, "No monthly reports found for this quarter");
        }

        // Calculate average scores for each skill
        const skillAverages = {};
        const skillCategories = ['Cognitive', 'Communication', 'Behavior', 'Attention', 'Others'];

        skillCategories.forEach(category => {
            const scores = monthlyReports.flatMap(report => 
                report.monthlyScore
                    .filter(score => score.skillName === category)
                    .map(score => score.marks)
            );

            skillAverages[category] = scores.length > 0 
                ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10
                : 0;
        });

        // Calculate overall average
        const overallAverage = Math.round(
            Object.values(skillAverages)
                .reduce((a, b) => a + b, 0) / Object.values(skillAverages).length * 10
        ) / 10;

        // Find or create quarterly report
        let quarterlyReport = await studentReport.findOne({
            studentDetails: student._id,
            'reportDetails.reportQuarter': timeFrame.quarter,
            'reportDetails.reportYear': timeFrame.year
        });

        if (!quarterlyReport) {
            quarterlyReport = new studentReport({
                studentDetails: student._id,
                reportDetails: {
                    reportYear: timeFrame.year,
                    reportQuarter: timeFrame.quarter
                }
            });
        }

        // Update the quarterly report with new averages
        quarterlyReport.programFeedback = {
            programSkillsFeedback: Object.entries(skillAverages).map(([skillName, skillScore]) => ({
                skillName,
                skillScore
            }))
        };
        quarterlyReport.overallScore = overallAverage;
        quarterlyReport.monthlyReports = monthlyReports.map(report => report._id);

        await quarterlyReport.save();

        // Populate the response data
        const populatedReport = await studentReport.findById(quarterlyReport._id)
            .populate("studentDetails", "StudentId firstName lastName program")
            .populate({
                path: "monthlyReports",
                select: "monthlyScore remarks timeFrame"
            });

        return res.status(200).json(
            new ApiResponse(
                200,
                populatedReport,
                "Quarterly report updated successfully with skill averages"
            )
        );

    } catch (err) {
        console.error(`Error updating quarterly report: ${err}`);
        throw new ApiError(400, err.message || "Error updating quarterly report");
    }
});

export { 
    generateStudentQuarterlyReport,
    generateMonthlyReport,
    fetchStudentReportById,
    fetchAllStudentReports,
    updateQuarterlyReport
};
