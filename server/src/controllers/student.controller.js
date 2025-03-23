import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/students.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { AdminNotification } from "../models/adminNotification.model.js";
import bcrypt from "bcryptjs";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: true,
  httpOnly: true,
  sameSite: "none",
};
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

  // Validate required fields
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

  // Check for existing student
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

  // Create new student
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
    educator: [],
  });

  // Generate tokens for the student
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    student._id
  );

  // Fetch the created student (excluding sensitive fields)
  const createdStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  if (!createdStudent) {
    throw new ApiError(500, "Failed to register student");
  }

  // Create a notification for the admin
  try {
    const notification = await AdminNotification.create({
      studentId: createdStudent._id,
      message: `New student registration request from ${firstName} ${lastName}`,
      type: "STUDENT_REGISTRATION",
      status: "PENDING",
    });
    console.log("Admin Notification created successfully:", notification);
  } catch (error) {
    console.error("Failed to create admin notification:", error);
    // Optionally handle notification creation errors
    // You might want to proceed with student registration even if notification fails
  }

  // Respond with success
  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          student: createdStudent,
          tokens: { accessToken, refreshToken },
        },
        "Student registered successfully. Admin has been notified."
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
    return res.status(403).json(
      new ApiResponse(
        403,
        null,
        "Your account is pending admin approval. Please wait for approval before logging in."
      )
    );
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

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
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
  const studentid = req.user?._id;

  if (!studentid) {
    throw new ApiError(400, "Student ID is required for logout");
  }

  const student = await Student.findById(studentid);
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
  const studentid = req.user?._id;

  if (!studentid) {
    throw new ApiError(400, "Student ID is required for fetching profile data");
  }

  const student = await Student.findById(studentid)
    .select("-password -refreshToken")
    .populate("educator", "name designation email")
    .populate("programs", "name description");

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const profileData = {
    enrollmentStatus: {
      isApproved: student.isApproved,
      status: student.status,
      enrollmentYear: student.enrollmentYear.getFullYear(),
    },
    assignedStaff: {
      primaryEducator: student.educator[0] || null,
      secondaryEducator: student.educator[1] || null,
    },
    programs: {
      enrolledPrograms: student.programs,
      numberOfSessions: student.numberOfSessions,
      timings: student.timings,
      daysOfWeek: student.daysOfWeek,
      sessionType: student.sessionType,
    },
    basicInfo: {
      name: `${student.firstName} ${student.lastName}`,
      email: student.studentEmail,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      StudentId: student.StudentId,
      avatar: student.avatar,
      UDID: student.UDID,
    },
    medicalInfo: {
      primaryDiagnosis: student.primaryDiagnosis,
      comorbidity: student.comorbidity,
      allergies: student.allergies,
      medicalHistory: student.medicalHistory,
    },
    guardianInfo: student.guardianDetails,
    preferences: {
      preferredLanguage: student.preferredLanguage,
      deviceAccess: student.deviceAccess,
      transport: student.transport,
    },
    address: student.address,
    strengths: student.strengths,
    weaknesses: student.weaknesses,
    comments: student.comments,
    progressReports: student.progressReports,
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

  const student = await Student.findOne({ StudentId: studentId }).select(
    "+password"
  );
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

const approveStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const { educatorIds, programIds } = req.body;

  if (!studentId) {
    throw new ApiError(400, "Student ID is required");
  }

  if (!educatorIds || !Array.isArray(educatorIds) || educatorIds.length !== 2) {
    throw new ApiError(
      400,
      "Two educators (primary and secondary) must be assigned"
    );
  }

  if (!programIds || !Array.isArray(programIds) || programIds.length === 0) {
    throw new ApiError(400, "At least one program must be assigned");
  }

  // Validate program IDs against allowed programs
  const validPrograms = [
    "Multi",
    "Job Readiness",
    "Vocation",
    "Spruha",
    "Suyog",
    "Sameti",
    "Shaale",
    "Siddhi",
    "Sattva",
  ];
  const invalidPrograms = programIds.filter(
    (program) => !validPrograms.includes(program)
  );
  if (invalidPrograms.length > 0) {
    throw new ApiError(
      400,
      `Invalid program(s): ${invalidPrograms.join(", ")}`
    );
  }

  const student = await Student.findOne({ StudentId: studentId });
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (student.isApproved) {
    throw new ApiError(400, "Student is already approved");
  }

  // Update student with approved status, educators, and programs
  student.isApproved = true;
  student.educator = educatorIds;
  student.programs = programIds;
  student.status = "Active";

  await student.save();

  const updatedStudent = await Student.findById(student._id)
    .select("-password -refreshToken")
    .populate("educator", "name designation email")
    .populate("programs", "name description");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedStudent, "Student approved successfully")
    );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  // Validate that StudentId is provided
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

    // Ensure the update was successful
    if (!updatedStudent) {
      throw new ApiError(500, "Failed to update student information");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedStudent, "Profile updated successfully")
      );
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new ApiError(400, error.message);
    }
    throw error;
  }
});

const uploadProfilePicture = asyncHandler(async (req, res) => {
  try {
    const studentid = req.user?._id;
    console.log(studentid);
    if (!studentid) {
      throw new ApiError(400, "Student ID is required");
    }

    if (!req.file) {
      throw new ApiError(400, "Please upload avatar file");
    }

    const localFilePath = req.file?.path;
    const avatar = await uploadOnCloudinary(localFilePath);

    if (!avatar.secure_url) {
      throw new ApiError(400, "Please try again, avatar not updated");
    }

    const student = await Student.findById(studentid);
    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    student.avatar.public_id = avatar.public_id;
    student.avatar.secure_url = avatar.secure_url;

    await student.save({ validateBeforeSave: false });


    return res
      .status(200)
      .json(new ApiResponse(200, student, "Avatar uploaded successfully"));
  } catch (error) {
    console.error(
      `Error occurred while updating profile picture: ${error.message}`
    );
    throw new ApiError(400, "Error occurred while uploading profile picture");
  }
});

export {
  registerStudent,
  loginStudent,
  logoutStudent,
  profilePage,
  changePassword,
  fetchAllStudents,
  updateProfile,
  approveStudent,
  uploadProfilePicture,
};
