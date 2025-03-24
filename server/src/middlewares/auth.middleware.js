import { Employee } from "../models/employee.model.js";
import { Student } from "../models/students.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Utility to verify token
const verifyToken = (token) => {

    if (!token) {
        throw new ApiError(403, "Unauthenticated request");
    }
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

// Middleware to verify student token
export const verifyStudent = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        console.log("token:", token);

        const decodedToken = verifyToken(token);
        console.log("decodedToken:", decodedToken);
        let user = await Student.findById(decodedToken?._id);

        if (!user) {
            user = await Employee.findById(decodedToken?._id);
                if (!user) {
                    throw new ApiError(403, "Invalid Access Token");
                }

        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new ApiError(403, "Access token expired, please log in again.");
        }
        console.error(`Error in user authentication: ${err}`);
        throw new ApiError(403, "Invalid or expired Access Token.");
    }
});

// Middleware to verify employee token
export const verifyEmployee = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        console.log("token:", token);

        const decodedToken = verifyToken(token);
        const user = await Employee.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(403, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new ApiError(403, "Access token expired, please log in again.");
        }
        console.error(`Error in user authentication: ${err}`);
        throw new ApiError(403, "Invalid or expired Access Token.");
    }
});

// Middleware to verify admin access
export const verifyAdmin = asyncHandler(async (req, res, next) => {
    try {
        const { user } = req;
        if (!user || user.role !== 'Admin') {
            throw new ApiError(403, "Access forbidden: Admins only.");
        }
        next();
    } catch (err) {
        console.error(`Error in admin verification: ${err}`);
        throw new ApiError(403, err?.message || "Unauthorized access denied.");
    }
});