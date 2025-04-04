import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Employee } from "../models/employee.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Student } from "../models/students.model.js";
import mongoose from "mongoose";
import xlsx from "xlsx";
import fs from "fs";


const cookieOptions = {
    httpOnly: true,
    secure: false, 
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
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

const createEmployeeAccount = asyncHandler(async (req, res) => {
    try {
        const {
            employeeId, name, gender, email, password, designation, department, employmentType, 
            program, phone, DOB, dateOfJoining, status, workLocation, bloodGroup
        } = req.body;

        if (!employeeId || !name || !email || !password || !designation || !department || !employmentType || !program || !phone || !DOB || !dateOfJoining || !status || !workLocation || !bloodGroup) {
            throw new ApiError(400, "All required fields must be provided");
        }

        const existingEmployee = await Employee.findOne({ $or: [{ email }, { phone }, { employeeId }] });
        if (existingEmployee) {
            throw new ApiError(400, "Employee with the provided email, phone, or employeeId already exists");
        }

        const user = await Employee.create({
            employeeId,
            name,
            gender,
            email,
            password,
            avatar: { public_id: "", secure_url: "" },
            designation,
            department,
            employmentType,
            program,
            phone,
            DOB,
            dateOfJoining,
            status,
            workLocation,
            bloodGroup,
            role: "Employee"  // ✅ Automatically assigned
        });

        const newUser = await Employee.findById(user._id).select("-password -refreshToken");
        if (!newUser) {
            throw new ApiError(500, "Failed to create employee account");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res.status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(new ApiResponse(201, { user, accessToken, refreshToken }, "Employee account created successfully"));
    } catch (err) {
        console.error(`Error occurred while creating employee account: ${err}`);
        throw new ApiError(500, err?.message || "Internal server error");
    }
});


const loginEmployeeAccount = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        // Find employee by email
        const user = await Employee.findOne({ email }).select("+password"); 
        console.log("user : ", user);
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

        // Set cookies with updated options
        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            gender : user.gender,
                            phone: user.phone,
                            DOB: user.DOB,
                            employeeId: user.employeeId,
                            avatar: user.avatar,
                            designation: user.designation,
                            department: user.department,
                            status : user.status,
                            workLocation : user.workLocation,
                            dateOfJoining : user.dateOfJoining,
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

const logoutEmployee = asyncHandler(async(req, res) => {
    try{
        const userId = req.user?._id;

        const employee = await Employee.findById(userId);
        if(!employee){
            throw new ApiError(404, "Employee not found");
        }

        employee.refreshToken = "";
        await employee.save({ validateBeforeSave : false });

        return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(
                200,
                {},
                "Employee logged out successfully"
            )
        )


    }catch(err){
        console.error(`Error occurred while logging out employee: ${err}`);
        throw new ApiError(500, err?.message || "Internal server error");
    }
})

const getEmployeeProfile = asyncHandler(async (req, res) => {
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


const addEducator = asyncHandler(async (req, res) => {
    try {
        const { 
            employeeId, name, gender, email, password, phone, DOB, 
            dateOfJoining, dateOfLeaving, status, workLocation, 
            emergencyContact, bloodGroup, designation, department, role, 
            employmentType, program 
        } = req.body;

        if (!employeeId || !name || !email || !password || !phone || !DOB || !dateOfJoining || !designation || !bloodGroup) {
            throw new ApiError(400, "All required fields must be provided");
        }

        const existingEmployee = await Employee.findOne({ 
            $or: [{ email }, { phone }, { employeeId }] 
        });

        if (existingEmployee) {
            throw new ApiError(400, "Employee with the provided email, phone, or employeeId already exists");
        }

        // Upload avatar only if file is provided
        let avatar = { public_id: "", secure_url: "" };
        if (req.file) {
            const uploadedAvatar = await uploadOnCloudinary(req.file.path);
            if (uploadedAvatar.secure_url) {
                avatar = {
                    public_id: uploadedAvatar.public_id,
                    secure_url: uploadedAvatar.secure_url
                };
            }
        }

        const educator = await Employee.create({
            employeeId,
            name,
            gender,
            email,
            password,
            avatar,
            designation: designation || "Educator", 
            department: department || "Special Education",
            role: role || "Employee",
            employmentType: employmentType || "Educator",
            program: program || "Multi",
            phone,
            DOB,
            dateOfJoining,
            dateOfLeaving: dateOfLeaving || null,
            status: status || "Active",
            workLocation: workLocation || "Foundation",
            emergencyContact: {
                name: emergencyContact?.name || "",
                contact: emergencyContact?.contact || ""
            },
            bloodGroup
        });

        return res.status(201).json(new ApiResponse(201, educator, "Educator account created successfully"));

    } catch (err) {
        console.error(`Error occurred while adding educator: ${err}`);
        throw new ApiError(500, err?.message || "Internal server error");
    }
});


const fetchAllEmployees = asyncHandler(async(req, res) => {
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

const approveStudentAccount = asyncHandler(async(req, res) => {
    try{
        const { studentId } = req.body;
        
        const student = await Student.findOne({ StudentId : studentId });
        if(!student){
            throw new ApiError(404, "No student exists with that id");
        }
        if(student.approval.status === "Approved"){
            throw new ApiError(400, "Student already approved");
        }

        student.approval.status = "Approved";
        await student.save();

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                student,
                "Student successfully approved"
            )
        )
    }catch(err){
        console.error(`Error occurred while approving student account`);
        throw new ApiError(400, "Error occurred while approving student account");
    }
})

const uploadProfilePicture = asyncHandler(async(req, res) => {
    try{

        const userId = req.user?._id;
        // console.log("User-Id : ", userId);
        if(req.file){
            const localPath = req.file?.path;
            const avatar = await uploadOnCloudinary(localPath);
            // console.log("Avatar : ", avatar);

            if(!avatar.secure_url){
                throw new ApiError(400, "Please try again, file not uploaded");
            }

            const user = await Employee.findById(userId);

            user.avatar.public_id = avatar.public_id;
            user.avatar.secure_url = avatar.secure_url;

            await user.save({ validateBeforeSave : false})

            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    user,
                    "User Avatar uploaded successfully"
                )
            )
        }else{
            throw new ApiError(400, "Please upload avatar file");
        }

    }catch(err){
        console.error(`Error occurred while uploading profile picture : ${err}`);
        throw new ApiError(400, "Error occurred while uploading profile picutre");
    }
})

const fetchStudentsAssignedToEducator = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json(new ApiError(400, "User ID is required"));
        }

        const userObjectId = new mongoose.Types.ObjectId(userId); // Convert to ObjectId

        const students = await Student.find({
            $or: [
                { "educators.primary": userObjectId },
                { "educators.secondary": userObjectId }
            ]
        }).select("StudentId firstName lastName program enrollmentYear status");

        res.status(200).json(new ApiResponse(200, students, "Students assigned to educators fetched successfully"));

    } catch (err) {
        console.error(`Error fetching students assigned to educators: ${err}`);
        res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
});

const uploadEmployeesDataFromExcel = asyncHandler(async(req, res) => {
    try{
        if(!req.file){
            throw new ApiError(400, "Please upload an excel file"); 
        }

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if(!sheetData.length){
            throw new ApiError(400, "Excel file is empty or invalid format");
        }

        const employees = sheetData.map((row) => ({
            employeeId: row["Employee ID"],
            name: row["Name"],
            gender: row["Gender"],
            email: row["Email"],
            password: row["Password"],
            designation: row["Designation"],
            department: row["Department"],
            employmentType: row["Employment Type"],
            program: row["Program"],
            phone: row["Phone"],
            DOB: row["Date of Birth"],
            dateOfJoining: row["Date of Joining"],
            status: row["Status"],
            workLocation: row["Work Location"],
            bloodGroup: row["Blood Group"]
        }));
        

        console.log("Employees : ", employees);

        await Employee.insertMany(employees);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); 
            console.log(`File ${filePath} successfully deleted..`);
        }
        return res.status(201)
        .json(
            new ApiResponse(
                201,
                employees,
                "Employees upoaded successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while uploading employees data from excel : ${err}`);
        throw new ApiError(400, "Error occurred while uploading employees data from excel");
    }
})


const deleteEmployeeAccount = asyncHandler(async(req, res) => {
    try{
        const userId = req.user?._id;

        const employee = await Employee.findById(userId);
        if(!employee){
            throw new ApiError(404, "Employee not found");
        }

        await employee.deleteOne();

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Employee account deleted successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while deleting employee account : ${err}`);
        throw new ApiError(400, "Error occurred while deleting employee account");
    }
})



export { 
    createEmployeeAccount,
    loginEmployeeAccount,
    logoutEmployee,
    getEmployeeProfile,
    addEducator,
    fetchAllEmployees,
    approveStudentAccount,
    uploadProfilePicture,
    deleteEmployeeAccount,
    fetchStudentsAssignedToEducator,
    uploadEmployeesDataFromExcel
}