import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { studentReport } from "../models/studentReport.model.js";
import { Student } from "../models/students.model.js";
import { Grade } from "../models/grades.model.js";

const generateStudentReport = asyncHandler(async (req, res) => {
    try {
        const {
            studentId,
            programFeedback,
            feedback,
            assessmentReport
        } = req.body;



        if (!feedback) {
            throw new ApiError(400, "Missing required fields for student report.");
        }


        const student = await Student.findOne({ StudentId : studentId });
        if (!student) {
            throw new ApiError(404, "Student not found.");
        }

        const grades = await Grade.find({ studentId : student._id}).select("_id");


        const newReport = new studentReport({
            studentDetails: student._id,
            programFeedback,
            feedback,
            assessmentReport : grades.map(grade => grade._id)
        });


        await newReport.save();


        const report = await studentReport.findById(newReport._id).populate("studentDetails", "StudentId firstName lastName program primaryDiagnosis guardianDetails.name guardianDetails.relation guardianDetails.contactNumber guardianDetails.parentEmail")
        .populate({
            path : "assessmentReport",
            select : "program marks feedback date"
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

export { generateStudentReport };
