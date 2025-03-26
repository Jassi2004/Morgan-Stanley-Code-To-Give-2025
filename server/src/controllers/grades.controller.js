import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Employee } from "../models/employee.model.js";
import { Grade } from "../models/grades.model.js";
import { Student } from "../models/students.model.js";

const giveGradesToStudent = asyncHandler(async (req, res) => {
    try {
        const { studentId, educatorId, marks, feedback, assessmentName } = req.body;
        // console.log("Manual Student ID:", studentId);
        // console.log("Educator ID:", educatorId);

        if (!isValidObjectId(educatorId)) {
            throw new ApiError(400, "Educator ID is not valid");
        }

        console.log("Student:", studentId);
        const student = await Student.findOne({ StudentId:studentId });
        console.log("Student:", student);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        const studentObjectId = student._id;

        const educator = await Employee.findById(educatorId);
        if (!educator) {
            throw new ApiError(404, "Educator not found");
        }

        const grade = await Grade.create({
            student: studentObjectId,
            educator: educatorId,
            program: educator.program,
            assessmentName,
            marks,
            feedback
        });

        return res.status(200).json(
            new ApiResponse(200, grade, "Successfully graded the student")
        );

    } catch (err) {
        console.error(`Error occurred while giving grades to student: ${err}`);
        throw new ApiError(400, "Error occurred while giving grades to student");
    }
});



export { 
    giveGradesToStudent
}