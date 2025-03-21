import { Employee } from "../models/employee.model.js";
import { Student } from "../models/students.model.js";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyStudent = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

        console.log("token : ", token);

        if (!token) {
            throw new ApiError(403, "Unauthenticated request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await Student.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(403, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(`Error in user authentication: ${err}`);
        throw new ApiError(403, "2113 Access Token");
    }
});

export const verifyEmployee = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

        console.log("token : ", token);

        if (!token) {
            throw new ApiError(403, "Unauthenticated request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await Employee.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(403, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(`Error in user authentication: ${err}`);
        throw new ApiError(403, "2113 Access Token");
    }
});


export const verifyAdmin = asyncHandler(async(req, res, next) => {
    try{
        const { user } = req;
        if(!user || user.role !== 'Admin'){
            throw new ApiError(403, "Access forbidden");
        }
        next();

    }catch(err){
        throw new ApiError(403, err?.message || "Un-authorized access denied !!");
    }
})


// to check if the user is student,we will only use verifyJWT and if we want to check if the user is employee or admin, then we will also check verifyAdmin / verifyEmployee along with the verifyJWT






