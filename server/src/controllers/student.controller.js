import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/students.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  let UDIDUrls = {};
  if (UDID?.isAvailable && req.files?.UDID?.[0]?.path) {
    UDIDUrls = await uploadOnCloudinary(req.files.UDID[0].path);
  }

  const student = await Student.create({
    StudentId,
    firstName,
    lastName,
    studentEmail,
    password,
    avatar: {
      public_id: avatar.public_id,
      secure_url: avatar.secure_url,
    },
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
      public_id: UDIDUrls?.public_id || "",
      secure_url: UDIDUrls?.secure_url || "",
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

  const student = await Student.findById(studentId);
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

  const student = await Student.findById(studentId).select(
    "-password -refreshToken"
  );

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const profileData = {
    name: `${student.firstName} ${student.lastName}`,
    email: student.studentEmail,
    gender: student.gender,
    primaryDiagnosis: student.primaryDiagnosis,
    enrollmentYear: student.enrollmentYear.getFullYear(),
    primaryEducator: student.educator[0]?.name || "Not Assigned",
    secondaryEducator: student.educator[1]?.name || "Not Assigned",
    programEnrolled: student.programs.map((program) => ({
      name: program.name,
      description: program.description,
    })),
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

  const student = await Student.findById(studentId).select("+password");
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

export {
  registerStudent,
  loginStudent,
  logoutStudent,
  profilePage,
  changePassword,
};
