
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Employee } from "../models/employee.model.js";
import { Grade } from "../models/grades.model.js";


const giveGradesToStudent = asyncHandler(async(req, res) => {
    try{
        const { studentId, educatorId, marks, feedback } = req.body;

        if(!isValidObjectId(studentId) || !isValidObjectId(educatorId)){
            throw new ApiError(400, "One of the id's is not valid");
        }

        const educator = await Employee.findById(educatorId);
        
        const grade = await Grade.create({
            student : studentId,
            educator : educatorId,
            program : educator.program,
            marks,
            feedback
        })


        return res.status(200)
        .json(
            new ApiResponse(
                200,
                grade,
                "Successfully graded the student"
            )
        )

    }catch(err){
        console.error(`Error occurred while giving grades to student : ${err}`);
        throw new ApiError(400, "Error occurred while giving grades to student");
    }
})


export { 
    giveGradesToStudent
}