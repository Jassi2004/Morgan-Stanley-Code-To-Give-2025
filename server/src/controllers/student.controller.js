import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/students.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcryptjs";

const generateAccessAndRefreshToken = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};

const registerStudent = asyncHandler(async (req, res) => {
  const {
    StudentId,
    firstName,
    lastName,
    studentEmail,
    password,
    gender,
    dateOfBirth,
    primaryDiagnosis,
    enrollmentYear,
    address,
    guardianDetails,
    preferredLanguage,
    transport,
    UDID,
  } = req.body;

  if (
    [
      StudentId,
      firstName,
      lastName,
      studentEmail,
      password,
      gender,
      dateOfBirth,
      primaryDiagnosis,
      enrollmentYear,
      address,
    ].some((field) => field === undefined || field.trim() === "")
  ) {
    throw new ApiError(400, "All required fields must be filled");
  }

  const existingStudent = await Student.findOne({
    $or: [{ studentEmail }, { StudentId }],
  });
  if (existingStudent) {
    throw new ApiError(409, "Student with the same email or ID already exists");
  }

  // const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar is required");
  // }
  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // if (!avatar) {
  //   throw new ApiError(500, "Failed to upload avatar");
  // }

  // let UDIDUrls = {};
  // if (UDID?.isAvailable && req.files?.UDID?.[0]?.path) {
  //   UDIDUrls = await uploadOnCloudinary(req.files.UDID[0].path);
  // }

  const student = await Student.create({
    StudentId,
    firstName,
    lastName,
    studentEmail,
    password,
    // avatar: {
    //   public_id: avatar.public_id,
    //   secure_url: avatar.secure_url,
    // },
    gender,
    dateOfBirth,
    primaryDiagnosis,
    enrollmentYear,
    address,
    guardianDetails,
    preferredLanguage: preferredLanguage || "English",
    transport: transport || false,
    UDID: {
      isAvailable: UDID?.isAvailable || false,
      // public_id: UDIDUrls?.public_id || "",
      // secure_url: UDIDUrls?.secure_url || "",
    },
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    student._id
  );

  const createdStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  if (!createdStudent) {
    throw new ApiError(500, "Failed to register student");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        student: createdStudent,
        tokens: { accessToken, refreshToken },
      },
      "Student registered successfully"
    )
  );
});

const loginStudent = asyncHandler(async (req, res) => {
  const { studentEmail, password } = req.body;

  if (!studentEmail || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const student = await Student.findOne({ studentEmail }).select("+password");
  if (!student) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!student.isApproved) {
    throw new ApiError(403, "Your account is pending admin approval");
  }

  const isPasswordCorrect = await student.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = student.generateAccessToken();
  const refreshToken = student.generateRefreshToken();

  student.refreshToken = refreshToken;
  await student.save({ validateBeforeSave: false });

  const responseStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        student: responseStudent,
        tokens: {
          accessToken,
          refreshToken,
        },
      },
      "Student logged in successfully"
    )
  );
});


const logoutStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    throw new ApiError(400, "Student ID is required for logout");
  }

  const student = await Student.findOne({StudentId:studentId});
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  student.refreshToken = null;
  await student.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Student logged out successfully"));
});

const profilePage = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    throw new ApiError(400, "Student ID is required for fetching profile data");
  }

  const student = await Student.findOne({StudentId:studentId}).select(
    "-password -refreshToken"
  );

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const profileData = {
    basicInfo: {
      name: `${student.firstName} ${student.lastName}`,
      email: student.studentEmail,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      StudentId: student.StudentId,
      avatar: student.avatar,
      UDID: student.UDID
    },
    medicalInfo: {
      primaryDiagnosis: student.primaryDiagnosis,
      comorbidity: student.comorbidity,
      allergies: student.allergies,
      medicalHistory: student.medicalHistory
    },
    educationalInfo: {
      enrollmentYear: student.enrollmentYear.getFullYear(),
      programs: student.programs,
      numberOfSessions: student.numberOfSessions,
      timings: student.timings,
      daysOfWeek: student.daysOfWeek,
      sessionType: student.sessionType,
      educators: student.educator,
      status: student.status
    },
    guardianInfo: student.guardianDetails,
    preferences: {
      preferredLanguage: student.preferredLanguage,
      deviceAccess: student.deviceAccess,
      transport: student.transport
    },
    address: student.address,
    strengths: student.strengths,
    weaknesses: student.weaknesses,
    comments: student.comments,
    progressReports: student.progressReports
  };

  return res
    .status(200)
    .json(new ApiResponse(200, profileData, "Profile fetched successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { studentId, oldPassword, newPassword } = req.body;

  if (!studentId || !oldPassword || !newPassword) {
    throw new ApiError(
      400,
      "Student ID, old password, and new password are required"
    );
  }

  const student = await Student.findOne({StudentId:studentId}).select("+password");
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const isOldPasswordCorrect = await student.isPasswordCorrect(oldPassword);
  if (!isOldPasswordCorrect) {
    throw new ApiError(401, "Old password is incorrect");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the old password"
    );
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters long");
  }

  student.password = await bcrypt.hash(newPassword, 10);
  await student.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

const fetchAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().select("-password -refreshToken");
  
  return res
    .status(200)
    .json(new ApiResponse(200, { students }, "Students fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    throw new ApiError(400, "Student ID is required for updating profile");
  }


  const updates = req.body;


  const student = await Student.findOne({ StudentId: studentId });
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (req.files?.avatar?.[0]?.path) {
    const avatar = await uploadOnCloudinary(req.files.avatar[0].path);
    if (avatar) {
      updates.avatar = {
        public_id: avatar.public_id,
        secure_url: avatar.secure_url,
      };
    }
  }

  if (req.files?.UDID?.[0]?.path) {
    const UDID = await uploadOnCloudinary(req.files.UDID[0].path);
    if (UDID) {
      updates.UDID = {
        isAvailable: true,
        public_id: UDID.public_id,
        secure_url: UDID.secure_url,
      };
    }
  }

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { StudentId: studentId },
      { $set: updates },
      {
        new: true, 
        runValidators: true, 
        select: "-password -refreshToken", 
      }
    );

    if (!updatedStudent) {
      throw new ApiError(500, "Failed to update student information");
    }

    return res.status(200).json(
      new ApiResponse(200, updatedStudent, "Profile updated successfully")
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new ApiError(400, error.message);
    }
    throw error;
  }
});

export {
  registerStudent,
  loginStudent,
  logoutStudent,
  profilePage,
  changePassword,
  fetchAllStudents,
  updateProfile
};
