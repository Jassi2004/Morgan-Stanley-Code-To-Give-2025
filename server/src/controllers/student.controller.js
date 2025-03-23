import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/students.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
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
    firstName,
    lastName,
    studentEmail,
    password,
    gender,
    dateOfBirth,
    primaryDiagnosis,
    allergies,
    transport,
    address,
    guardianDetails,
    preferredLanguage,
    sessionType,
    fathersName,
    mothersName,
    parentEmail,
    contactNumber,
    UDID // Optional field
  } = req.body;

  // Generate StudentId
  const StudentId = `STU${Date.now()}`;

  // Validate required fields
  if (
    [
      firstName,
      lastName,
      studentEmail, // Added to required fields
      password,
      gender,
      dateOfBirth,
      primaryDiagnosis,
      address,
      fathersName,
      mothersName,
      parentEmail,
      contactNumber
    ].some((field) => field === undefined || field.trim() === "")
  ) {
    throw new ApiError(400, "All required fields must be filled.");
  }

  // Check for existing student
  const existingStudent = await Student.findOne({
    $or: [{ studentEmail }, { StudentId }],
  });
  if (existingStudent) {
    throw new ApiError(
      409,
      "Student with the same email or ID already exists."
    );
  }

  // Create new student
  const student = await Student.create({
    StudentId,
    firstName,
    lastName,
    studentEmail,
    password,
    gender,
    dateOfBirth,
    primaryDiagnosis,
    allergies: allergies || [],
    transport: transport || false,
    address,
    guardianDetails: {
      name: fathersName,
      relation: "Father",
      contactNumber,
      parentEmail
    },
    preferredLanguage: preferredLanguage || "English",
    sessionType: sessionType || "Offline",
    UDID: {
      isAvailable: UDID?.isAvailable || false,
      public_id: UDID?.public_id || "",
      secure_url: UDID?.secure_url || ""
    }
  });

  // Rest of the code remains the same...
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(student._id);

  const createdStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  if (!createdStudent) {
    throw new ApiError(500, "Failed to register student.");
  }

  let notification;
  try {
    notification = await AdminNotification.create({
      studentId: createdStudent._id,
      message: `New student registration request from ${firstName} ${lastName}`,
      type: "STUDENT_REGISTRATION",
      status: "PENDING",
    });
    console.log("Admin notification created successfully:", notification);
  } catch (error) {
    console.error("Failed to create admin notification:", error);
    throw new ApiError(500, "Failed to notify admin. Registration is incomplete.");
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          student: createdStudent,
          notification: notification,
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
    return res.status(200).json({
      message: "Please wait for admin approval before logging in."
    });
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
    .populate("educators.primary", "name designation email")
    .populate("educators.secondary", "name designation email");

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const profileData = {
    basicInfo: {
      StudentId: student.StudentId,
      firstName: student.firstName,
      lastName: student.lastName,
      studentEmail: student.studentEmail,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      avatar: student.avatar,
      UDID: student.UDID
    },
    enrollmentStatus: {
      isApproved: student.isApproved,
      status: student.status,
      enrollmentYear: student.enrollmentYear
    },
    medicalInfo: {
      primaryDiagnosis: student.primaryDiagnosis,
      comorbidity: student.comorbidity,
      allergies: student.allergies,
      medicalHistory: {
        medications: student.medicalHistory?.medications || [],
        surgeries: student.medicalHistory?.surgeries || [],
        notes: student.medicalHistory?.notes
      }
    },
    programDetails: {
      program: student.program,
      numberOfSessions: student.numberOfSessions,
      timings: student.timings,
      daysOfWeek: student.daysOfWeek,
      sessionType: student.sessionType
    },
    educatorInfo: {
      primary: student.educators?.primary || null,
      secondary: student.educators?.secondary || null
    },
    guardianDetails: {
      name: student.guardianDetails?.name,
      relation: student.guardianDetails?.relation,
      contactNumber: student.guardianDetails?.contactNumber,
      parentEmail: student.guardianDetails?.parentEmail
    },
    preferences: {
      preferredLanguage: student.preferredLanguage,
      transport: student.transport
    },
    address: student.address,
    strengths: student.strengths || [],
    weaknesses: student.weaknesses || [],
    comments: student.comments,
    progressReports: student.progressReports?.map(report => ({
      date: report.date,
      educator: report.educator,
      report: report.report
    })) || []
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

  // Handle file uploads if present
  if (req.files) {
    // Handle avatar upload
    if (req.files.avatar?.[0]?.path) {
      const avatar = await uploadOnCloudinary(req.files.avatar[0].path);
      if (avatar?.secure_url) {
        updates.avatar = {
          public_id: avatar.public_id,
          secure_url: avatar.secure_url,
        };
      }
    }

    // Handle UDID upload
    if (req.files.UDID?.[0]?.path) {
      const UDID = await uploadOnCloudinary(req.files.UDID[0].path);
      if (UDID?.secure_url) {
        updates.UDID = {
          isAvailable: true,
          public_id: UDID.public_id,
          secure_url: UDID.secure_url,
        };
      }
    }
  }

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { StudentId: studentId },
      { $set: updates },
      {
        new: true, // Return the updated document
        runValidators: true, // Validate updates
        select: "-password -refreshToken" // Exclude sensitive fields
      }
    );

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
  const studentid = req.user?._id;

  if (!studentid) {
    throw new ApiError(400, "Student ID is required");
  }

  if (!req.file) {
    throw new ApiError(400, "Please upload avatar file");
  }

  const student = await Student.findById(studentid);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // Upload to cloudinary
  const localFilePath = req.file.path;
  const avatar = await uploadOnCloudinary(localFilePath);

  if (!avatar?.secure_url) {
    throw new ApiError(400, "Failed to upload avatar to cloud storage");
  }

  // Delete old avatar from cloudinary if exists
  if (student.avatar?.public_id) {
    try {
      await deleteFromCloudinary(student.avatar.public_id);
    } catch (error) {
      console.error("Failed to delete old avatar:", error);
      // Continue with update even if delete fails
    }
  }

  // Update student avatar
  student.avatar = {
    public_id: avatar.public_id,
    secure_url: avatar.secure_url
  };

  const updatedStudent = await student.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        {
          avatar: updatedStudent.avatar
        },
        "Avatar uploaded successfully"
      )
    );
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
