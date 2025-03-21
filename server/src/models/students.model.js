import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const studentSchema = new mongoose.Schema(
  {
    StudentId: {
      type: String,
      unique: [true, "student id already exists"],
      required: [true, "student id is required"],
      index: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
    },
    studentEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill in a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "Password must be of atleast 8 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    gender: {
      type: String,
      required: [true, "gender is required"],
    },
    UDID: {
      isAvailable: {
        type: Boolean,
        default: false,
      },
      public_id: {
        type: String,
        default: "",
      },
      secure_url: {
        type: String,
        required: function (){
            return this.UDID.isAvailable;
        }
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    primaryDiagnosis: {
      type: String,
      enum: ["Autism", "Down Syndrome", "ADHD", "Cerebral Palsy", "Others"],
      required: [true, "primary diagnosis is required"],
    },
    comorbidity: {
      type: Boolean,
      default: false,
    },
    enrollmentYear: {
      type: Date,
      required: [true, "enrollment year is required"],
      min: [2015, "Year must be valid"],
      max: [new Date().getFullYear(), "Enrollment year cannot be in the future"],
    },
    programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],
    numberOfSessions: {
      type: Number,
      required: true,
      default: 0,
    },
    timings: {
        type: String,
        validate: {
          validator: function (v) {
            return /^\d{2}:\d{2} - \d{2}:\d{2}$/.test(v); 
          },
          message: "Timings must be in HH:MM - HH:MM format",
        },
    },
    daysOfWeek: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "All",
      ],
      default: ["All"],
    },
    educator: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    sessionType: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
    },
    allergies: {
      type: [String],
      default: [],
    },
    transport: {
      type: Boolean,
      default: false
    },
    address: {
      type: "string",
      required: [true, "address is required"],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    comments: {
      type: String,
    },
    status: {
        type: String,
        enum: ["Active", "Graduated"],
        default: "Pending",
    },
    guardianDetails: {
      name: { type: String, required: [true, "Guardian name is required"] },
      relation: {
        type: String,
        required: [true, "Guardian relation is required"],
      },
      contactNumber: {
        type: String,
        required: [true, "Guardian contact number is required"],
        validate: {
          validator: function (v) {
            return /^[6-9]\d{9}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid contact number!`,
        },
      },
      parentEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please enter a valid email address",
        ],
      },
    },
    medicalHistory: {
      medications: { type: [String], default: [] },
      surgeries: { type: [String], default: [] },
      notes: { type: String },
    },
    
    preferredLanguage: {
      type: String,
      enum: ["English", "Hindi", "Marathi", "Sign Language", "Other"],
      default: "English",
    },
    deviceAccess: {
      type: [String],
      enum: ["Tablet", "Laptop", "Smartphone", "Hearing Aid", "Braille Device"],
      default: [],
    },

    refreshToken: {
      type: String,
    },


    progressReports: [{
        date: {
            type: Date,
            default: Date.now,
        },
        educator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
        },
        report: {
            type: String,
            required: true,
            maxLength: 1000
        },
    }],

    
  },
  { timestamps: true }
);


studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.studentEmail,
      firstName: this.firstName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

studentSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const Student = mongoose.model("Student", studentSchema);
