import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/students.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { AdminNotification } from "../models/adminNotification.model.js";
import bcrypt from "bcryptjs";
import xlsx from "xlsx";
import fs from "fs";
import { Employee } from "../models/employee.model.js";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: false,
  httpOnly: true,
  sameSite: "lax",
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
    address,
    fathersName,
    mothersName,
    parentEmail,
    allergies,
    transport,
    sessionType,
    contactNumber,
    altContactNumber,
  } = req.body;

  console.log(req.body);


  const StudentId = `STU${Date.now()}`;

  // Validate required fields
  if (
    [
      firstName,
      lastName,
      studentEmail,
      password,
      gender,
      dateOfBirth,
      primaryDiagnosis,
      address,
      fathersName,
      mothersName,
      parentEmail,
      contactNumber,
    ].some((field) => {
      if (field === undefined || field === null) return true;
      if (typeof field === "string") return field.trim() === "";
      if (typeof field === "number") return field === 0;
      return true;
    })
  ) {
    throw new ApiError(400, "All required fields must be filled.");
  }

  const existingStudent = await Student.findOne({
    $or: [{ studentEmail }, { StudentId }],
  });
  if (existingStudent) {
    throw new ApiError(
      409,
      "Student with the same email or ID already exists."
    );
  }

  let avatar = null;
  let UDID = null;

  if (req.files) {
    if (req.files.avatar) {
      const avatarPath = req.files.avatar[0].path;
      const { secure_url, public_id } = await uploadOnCloudinary(avatarPath);
      avatar = { secure_url, public_id };
    }
    if (req.files.UDIDDocument) {
      {
        const UDIDPath = req.files.UDIDDocument[0].path;
        const { secure_url, public_id } = await uploadOnCloudinary(UDIDPath);
        UDID = { secure_url, public_id, isAvailable: true };
      }
    }
  }

  // Create new student with default values for required fields
  const student = await Student.create({
    StudentId,
    firstName,
    lastName,
    studentEmail,
    password,
    gender,
    dateOfBirth: new Date(dateOfBirth),
    primaryDiagnosis,
    address,
    fathersName,
    mothersName,
    parentEmail,
    contactNumber: Number(contactNumber),
    altContactNumber: Number(altContactNumber) || undefined,
    status: "Active",
    avatar: avatar || undefined,

    // Optional fields with defaults
    allergies: allergies || [],
    transport: transport || false,
    sessionType: sessionType || "Offline",
    UDID: UDID || {
      isAvailable: false,
      secure_url: "",
      public_id: "",
    },
    educators: {
      primary: null,
      secondary: null,
    },
  });

  // Create admin notification for new student registration
  await AdminNotification.create({
    title: "New Student Registration",
    message: `New student ${firstName} ${lastName} has registered. Please review and approve.`,
    type: "STUDENT_REGISTRATION",
    studentId: student._id,
    status: "PENDING",
  });

  const createdStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  if (!createdStudent) {
    throw new ApiError(
      500,
      "Something went wrong while registering the student"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdStudent, "Student registered successfully")
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

  if (student.approval.status === "PENDING") {
    return res.status(200).json({
      message: "Please wait for admin approval before logging in.",
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
  const studentId = req.params.studentId || req.user?._id;
  // console.log("Student Id: ", studentId);

  if (!studentId) {
    throw new ApiError(400, "Student ID is required for fetching profile data");
  }


  const student = await Student.findOne({ StudentId: studentId })
    .select("-password -refreshToken")
    .populate({
      path: "educators.primary",
      select: "name designation email",
      match: { _id: { $exists: true } },
    })
    .populate({
      path: "educators.secondary",
      select: "name designation email",
      match: { _id: { $exists: true } },
    });

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
      UDID: student.UDID,
      contactNumber: student.contactNumber,
      altContactNumber: student.altContactNumber,
    },
    enrollmentStatus: {
      approvalStatus: student.approval.status,
      status: student.status,
      enrollmentYear: student.enrollmentYear,
    },
    medicalInfo: {
      primaryDiagnosis: student.primaryDiagnosis,
      comorbidity: student.comorbidity,
      allergies: student.allergies,
      medicalHistory: {
        medications: student.medicalHistory?.medications || [],
        surgeries: student.medicalHistory?.surgeries || [],
        notes: student.medicalHistory?.notes,
      },
    },
    programDetails: {
      program: student.program,
      numberOfSessions: student.numberOfSessions,
      timings: student.timings,
      daysOfWeek: student.daysOfWeek,
      sessionType: student.sessionType,
    },
    educatorInfo: {
      primary: student.educators?.primary || null,
      secondary: student.educators?.secondary || null,
    },
    guardianDetails: {
      fathersName: student.fathersName,
      mothersName: student.mothersName,
      parentEmail: student.parentEmail
    },
    preferences: {
      preferredLanguage: student.preferredLanguage,
      transport: student.transport,
    },
    address: student.address,
    strengths: student.strengths || [],
    weaknesses: student.weaknesses || [],
    comments: student.comments,
    progressReports:
      student.progressReports?.map((report) => ({
        date: report.date,
        educator: report.educator,
        report: report.report,
      })) || [],
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

  if (student.approval.status === "approved") {
    throw new ApiError(400, "Student is already approved");
  }

  student.approval.status = "approved";
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
  try {
    const { studentId } = req.body;
    console.log("Received update request for student:", studentId);
    console.log("Files received:", req.files);
    console.log("Request body:", req.body);

    // Validate that StudentId is provided
    if (!studentId) {
      throw new ApiError(400, "Student ID is required for updating profile");
    }

    const updates = req.body;

    // Parse all stringified JSON objects with error handling
    let basicInfo, enrollmentStatus, medicalInfo, programDetails, educatorInfo, guardianDetails, preferences, strengths, weaknesses;
    
    try {
      basicInfo = JSON.parse(updates.basicInfo || '{}');
      enrollmentStatus = JSON.parse(updates.enrollmentStatus || '{}');
      medicalInfo = JSON.parse(updates.medicalInfo || '{}');
      programDetails = JSON.parse(updates.programDetails || '{}');
      educatorInfo = JSON.parse(updates.educatorInfo || '{}');
      guardianDetails = JSON.parse(updates.guardianDetails || '{}');
      preferences = JSON.parse(updates.preferences || '{}');
      strengths = JSON.parse(updates.strengths || '[]');
      weaknesses = JSON.parse(updates.weaknesses || '[]');
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      throw new ApiError(400, "Invalid JSON data in request");
    }

    console.log("Parsed data:", {
      basicInfo,
      enrollmentStatus,
      medicalInfo,
      programDetails,
      educatorInfo,
      guardianDetails,
      preferences,
      strengths,
      weaknesses
    });

    const student = await Student.findOne({ StudentId: studentId });
    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    // Handle file uploads if they exist
    let avatar = student.avatar;
    let UDID = student.UDID;

    if (req.files) {
      try {
        if (req.files.avatar) {
          const avatarPath = req.files.avatar[0].path;
          const { secure_url, public_id } = await uploadOnCloudinary(avatarPath);
          avatar = { secure_url, public_id };
          console.log("Avatar uploaded successfully:", avatar);
        }
        if (req.files.UDID) {
          const UDIDPath = req.files.UDID[0].path;
          const { secure_url, public_id } = await uploadOnCloudinary(UDIDPath);
          UDID = { secure_url, public_id, isAvailable: true };
          console.log("UDID uploaded successfully:", UDID);
        }
      } catch (uploadError) {
        console.error("Error uploading files:", uploadError);
        throw new ApiError(500, "Failed to upload files");
      }
    }

    // Create update object with all fields
    const updateObject = {
      firstName: basicInfo.firstName || student.firstName,
      lastName: basicInfo.lastName || student.lastName,
      studentEmail: basicInfo.studentEmail || student.studentEmail,
      gender: basicInfo.gender || student.gender,
      dateOfBirth: basicInfo.dateOfBirth ? new Date(basicInfo.dateOfBirth) : student.dateOfBirth,
      contactNumber: basicInfo.contactNumber || student.contactNumber,
      altContactNumber: basicInfo.altContactNumber || student.altContactNumber,
      address: updates.address || student.address,
      avatar: avatar,
      UDID: UDID,
      comments: updates.comments || student.comments,
      program: programDetails.program || student.program,
      program2: programDetails.program2 || student.program2,
      numberOfSessions: programDetails.numberOfSessions || student.numberOfSessions,
      sessionType: programDetails.sessionType || student.sessionType,
      daysOfWeek: programDetails.daysOfWeek || student.daysOfWeek,
      status: enrollmentStatus.status || student.status,
      primaryDiagnosis: medicalInfo.primaryDiagnosis || student.primaryDiagnosis,
      comorbidity: medicalInfo.comorbidity || student.comorbidity,
      allergies: medicalInfo.allergies || student.allergies,
      strengths: strengths || student.strengths,
      weaknesses: weaknesses || student.weaknesses,
      fathersName: guardianDetails.fathersName || student.fathersName,
      mothersName: guardianDetails.mothersName || student.mothersName,
      parentEmail: guardianDetails.parentEmail || student.parentEmail,
      transport: preferences.transport || student.transport,
    };

    // Handle educator updates
    if (updates.educators) {
      updateObject.educators = {
        primary: updates.educators.primary || student.educators?.primary,
        secondary: updates.educators.secondary || student.educators?.secondary,
      };
      console.log("Updating educators:", updateObject.educators);
    }

    console.log("Final update object:", JSON.stringify(updateObject, null, 2));

    const updatedStudent = await Student.findOneAndUpdate(
      { StudentId: studentId },
      { $set: updateObject },
      {
        new: true,
        runValidators: true,
        select: "-password -refreshToken",
      }
    ).populate({
      path: "educators.primary",
      select: "name designation email program",
    }).populate({
      path: "educators.secondary",
      select: "name designation email program",
    });

    if (!updatedStudent) {
      throw new ApiError(500, "Failed to update student information");
    }

    console.log("Student updated successfully:", {
      id: updatedStudent._id,
      name: `${updatedStudent.firstName} ${updatedStudent.lastName}`,
      educators: updatedStudent.educators
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedStudent, "Profile updated successfully")
      );
  } catch (error) {
    console.error("Error updating student:", error);
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
    secure_url: avatar.secure_url,
  };

  const updatedStudent = await student.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        avatar: updatedStudent.avatar,
      },
      "Avatar uploaded successfully"
    )
  );
});

const uploadStudentDataFromExcel = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "Please upload an Excel file");
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      throw new ApiError(400, "Excel file is empty or has an invalid format");
    }

    const validPrimaryDiagnosis = [
      "Autism",
      "Down Syndrome",
      "ADHD",
      "Cerebral Palsy",
      "Others",
    ];
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
    const validSessionTypes = ["Online", "Offline"];

    const students = await Promise.all(
      sheetData.map(async (row) => {
        // Normalize and Validate Enrollment Year
        let enrollmentYear = row["Enrollment Year"]
          ? new Date(row["Enrollment Year"])
          : null;
        if (
          !enrollmentYear ||
          enrollmentYear < new Date("2015-01-01") ||
          enrollmentYear > new Date()
        ) {
          enrollmentYear = new Date(); // Default to current year if invalid
        }

        // Convert Educator Names to ObjectId
        let primaryEducator = null;
        let secondaryEducator = null;
        if (row["Educator"]) {
          const primary = await Employee.findOne({ name: row["Educator"] });
          primaryEducator = primary ? primary._id : null;
        }
        if (row["Secondary Educator"]) {
          const secondary = await Employee.findOne({
            name: row["Secondary Educator"],
          });
          secondaryEducator = secondary ? secondary._id : null;
        }

        return {
          StudentId: row["Student ID"] || `STU${Date.now()}`, // Generate ID if missing
          firstName: row["First Name"] || "Unknown",
          lastName: row["Last Name"] || "Unknown",
          studentEmail:
            row["Student Email"] || `student${Date.now()}@email.com`,
          password: row["Password"] || "Default@123", // Hardcoded password
          gender: row["Gender"] || "Not Specified",
          dateOfBirth: row["DOB"]
            ? new Date(row["DOB"])
            : new Date("2000-01-01"), // Default DOB
          primaryDiagnosis: validPrimaryDiagnosis.includes(
            row["Primary Diagnosis"]
          )
            ? row["Primary Diagnosis"]
            : "Others",
          comorbidity: row["Comorbidity"] === "Yes",
          enrollmentYear,
          program: validPrograms.includes(row["Program"])
            ? row["Program"]
            : "Multi",
          numberOfSessions: row["Number of Sessions"] || 0,
          timings: row["Timings"] || "09:00 - 10:00",
          daysOfWeek: row["Days of Week"]
            ? row["Days of Week"].split(",")
            : ["All"],
          sessionType: validSessionTypes.includes(row["Session Type"])
            ? row["Session Type"]
            : "Offline",
          address: row["Address"] || "Unknown",
          transport: row["Transport"] === "Yes",
          status: row["Status"] || "Active",
          UDID: row["UDID"] || null,
          educators: {
            primary: primaryEducator,
            secondary: secondaryEducator,
          },
          fathersName: row["Father's Name"] || "Unknown",
          mothersName: row["Mother's Name"] || "Unknown",
          parentEmail: row["Parent Email"] || "parent@email.com",
          contactNumber: row["Contact Number"] || "0000000000",
          altContactNumber: row["Alternate Contact Number"] || undefined,
          password: row["Password"],
        };
      })
    );

    await Student.insertMany(students);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File ${filePath} successfully deleted..`);
    }

    res
      .status(201)
      .json(new ApiResponse(201, students, "Student data added successfully"));
  } catch (err) {
    console.error(
      `Error occurred while uploading student data from excel: ${err}`
    );
    throw new ApiError(
      400,
      `Error occurred while uploading student data: ${err.message}`
    );
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
  uploadStudentDataFromExcel,
};
