import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Employee } from "../models/employee.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";




const cookieOptions = {
    maxAge : 7 * 24 * 60 * 60 * 1000,
    secure : true,
    httpOnly : true,
    sameSite : "none"
}

const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await Employee.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false });
        return {accessToken, refreshToken};
    }catch(err){
        throw new ApiError(500, "Error generating Access and Refresh Tokens");
    }
}

export const createEmployeeAccount = asyncHandler(async (req, res) => {
    try {
        const { employeeId, name, gender, email, password, designation, department, employmentType, program, phone, DOB, dateOfJoining, status, workLocation, emergencyContact, bloodGroup } = req.body;
        
        if (!employeeId || !name || !email || !password || !designation || !department || !employmentType || !program || !phone || !DOB || !dateOfJoining || !status || !workLocation || !emergencyContact || !bloodGroup) {
            throw new ApiError(400, "All required fields must be provided");
        }

        const existingEmployee = await Employee.findOne({ $or: [{ email }, { phone }, { employeeId }] });
        if (existingEmployee) {
            throw new ApiError(400, "Employee with the provided email, phone, or employeeId already exists");
        }
        

        if (req.file) {
            const avatar = await uploadOnCloudinary(req.file.path);

            if(!avatar.secure_url){
                throw new ApiError(500, "Failed to upload avatar");
            }


            const user = await Employee.create({
                employeeId,
                name,
                gender,
                email,
                password,
                avatar: {
                    public_id : avatar.public_id,
                    secure_url : avatar.secure_url
                },
                designation,
                department,
                employmentType,
                program,
                phone,
                DOB,
                dateOfJoining,
                status,
                workLocation,
                emergencyContact,
                bloodGroup
            });

            const newUser = await Employee.findById(user._id).select("-password -refreshToken");
            if(!newUser){
                throw new ApiError(500, "Failed to create employee account");
            }
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

            return res.status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    201,
                    {
                        user, 
                        accessToken, 
                        refreshToken
                    },
                "Employee account created successfully"
                )
            )
            
        }else{
            throw new ApiError(400, "Avatar is required");
        }

    } catch (err) {
        console.error(`Error occurred while creating employee account: ${err}`);
        throw new ApiError(500, err?.message || "Internal server error");
    }
});

export const loginEmployeeAccount = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        // Find employee by email
        const user = await Employee.findOne({ email }).select("+password"); 
        if (!user) {
            throw new ApiError(401, "Invalid email or password");
        }

        // Check password
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid email or password");
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            employeeId: user.employeeId,
                            avatar: user.avatar,
                            designation: user.designation,
                            department: user.department
                        },
                        accessToken,
                        refreshToken
                    },
                    "Login successful"
                )
            );
    } catch (err) {
        console.error(`Error occurred during login: ${err}`);
        throw new ApiError(500, err?.message || "Internal server error");
    }
});

export const getEmployeeProfile = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id; // Extract userId from authenticated request

        if (!userId) {
            throw new ApiError(401, "Unauthorized: Invalid token");
        }

        // Fetch user profile (excluding password and refreshToken)
        const user = await Employee.findById(userId).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(404, "Employee not found");
        }

        return res.status(200).json(new ApiResponse(200, user, "Profile fetched successfully"));
    } catch (err) {
        console.error(`Error occurred while fetching profile: ${err}`);
        throw new ApiError(500, err?.message || "Internal server error");
    }
});


export const addEducator = asyncHandler(async (req, res) => {
    try {
        const { employeeId, name, gender, email, password, phone, DOB, dateOfJoining, emergencyContact, bloodGroup, designation } = req.body;

        if (!employeeId || !name || !email || !password || !phone || !DOB || !dateOfJoining || !designation || !emergencyContact || !bloodGroup) {
            throw new ApiError(400, "All required fields must be provided");
        }

        const existingEmployee = await Employee.findOne({ $or: [{ email }, { phone }, { employeeId }] });
        if (existingEmployee) {
            throw new ApiError(400, "Employee with the provided email, phone, or employeeId already exists");
        }

        let avatar;
        if (req.file) {
            avatar = await uploadOnCloudinary(req.file.path);
            if (!avatar.secure_url) {
                throw new ApiError(500, "Failed to upload avatar");
            }
        } else {
            throw new ApiError(400, "Avatar is required");
        }

        const educator = await Employee.create({
            employeeId,
            name,
            gender,
            email,
            password,
            avatar: {
                public_id: avatar.public_id,
                secure_url: avatar.secure_url
            },
            designation: "Educator",
            department: "Special Education",
            role: "Employee",
            employmentType: "Educator",
            program: "Multi",
            phone,
            DOB,
            dateOfJoining,
            status: "Active",
            workLocation: "Foundation",
            emergencyContact,
            bloodGroup
        });

        return res.status(201).json(new ApiResponse(201, educator, "Educator account created successfully"));

    } catch (err) {
        console.error(`Error occurred while adding educator: ${err}`);
        throw new ApiError(500, err?.message || "Internal server error");
    }
});


export const fetchAllEmployees = asyncHandler(async(req, res) => {
    try{

        const employees = await Employee.find({}).select("-password -refreshToken");
        if(!employees){
            throw new ApiError(404, "No employees found");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                employees,
                "All employees fetched successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching all employees : ${err}`);
        throw new ApiError(400, "Error occurred while fetching all employees");
    }
})

export { 
    createEmployeeAccount,
    loginEmployeeAccount,
    getEmployeeProfile,
    addEducator,
    fetchAllEmployees
}