import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { studentReport } from "../models/studentReport.model.js";
import { Student } from "../models/students.model.js";
import { Grade } from "../models/grades.model.js";
import { monthlyReport } from "../models/monthlyReports.model.js";

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


const generateMonthlyReport = asyncHandler(async(req, res) => {
    try{

        const { studentId, monthlyScore, remarks, timeFrame } = req.body;
        if(!studentId || !monthlyScore || !remarks){
            throw new ApiError(400, "Required fields not provided");
        } 

        if(monthlyScore < 1 || monthlyScore > 5){
            throw new ApiError(400, "Monthly Score must be between 0 and 100");
        }

        const currentDate = new Date();
        const month = currentDate.toLocaleString("en-US", {month : "short"});
        const year = currentDate.getFullYear().toString();
        const quarter = `Q${Math.ceil((currentDate.getMonth() + 1) / 3)}`;

        const report = await monthlyReport.create({
            studentDetails : studentId,
            monthlyScore,
            remarks,
            timeFrame : timeFrame || { month, year, quarter}
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                report,
                "Student Monthly report successfully generated"
            )
        );


    }catch(err){
        console.error(`Error occurred while generating monthly reports : ${err}`);
        throw new ApiError(400, "Error occurred while generating monthly reports !!");
    }
})



export { generateStudentQuarterlyReport, generateMonthlyReport };
