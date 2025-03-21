import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const employeeSchema = new Schema({
    employeeId : {
        type : String,
        unique : [true, "employeeId already exists"],
        required : [true, "EmployeeId is required"]
    },
    name : {
        type : String,
        trim : true,
        required : [true, "Name of the employee is required"]
    },
    gender : {
        type : String,
        enum : ["MALE", "FEMALE"]
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : [true, "Email already exists"],
        lowercase : true,
        trim : true,
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please fill in a valid email address"
        ]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        minLength : [8, "Password must be of atleast 8 characters"],
        select : false
    },
    avatar : {
        public_id : {
            type : String,
        },
        secure_url : {
            type : String,
        }
    },
    designation : {
        type : String,
        enum : ["Founder", "Co-Founder", "Program Director", "Manager", "Program Associate", "Jr. Program Associate", "Admin", "Educator"],
        required : [true, "Designation of the employee is required"]
    },
    department : {
        type : String,
        enum : ["Management", "Admin", "Special Education", "Design"],
        required : [true, "Department of employee is required"]
    },
    role : {
        type : String,
        enum : ["Admin", "Hr", "Employee"],
        default : "Employee"
    },
    employmentType : {
        type : String,
        enum : ["Trustee", "FTE", "Intern", "Educator", "Volunteer"],
        required : [true, "Employment Type is required"]
    },
    program : {
        type : String,
        enum : ["Multi", "Job Readiness", "Vocation", "Spruha", "Suyog", "Sameti", "Shaale", "Siddhi", "Sattva"],
        required : [true, "Program is required"]
    },
    phone : {
        type : String,
        unique : [true, "Phone number already exists"],
        required : [true, "Phone number is required of the employee"]
    },
    DOB : {
        type : Date,
        required : [true, "Date-of-Birth is Required"]
    },
    dateOfJoining : {
        type : Date,
        required : [true, "Date of Joining is required"]
    },
    dateOfLeaving : {
        type : Date
    },
    status : {
        type : String,
        enum : ["Active", "Discontinued", "Temporary Discontinue"],
        default : "Active",
        required : [true, "Status of the employement is required"],
    },
    tenure: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(?:(\d+) Months )?(\d+) Years$/.test(v);
            },
            message: "Tenure must be in the format 'X Months Y Years' or 'Y Years'",
        },
    },
    
    workLocation : {
        type : String,
        enum : ["Foundation", "Academy"],
    },
    emergencyContact : {
        name : {
            type : String,
        },
        contact : {
            type : String,
        }
    },
    bloodGroup : {
        type : String,
        enum : ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        required : [true, "Blood Group is required"]
    },
    refreshToken : {
        type : String,
        select : false
    }

}, {
    timestamps : true
});


employeeSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcryptjs.hash(this.password, 10);
    next();
})

employeeSchema.methods = {
    generateAccessToken : function(){
        return jwt.sign(
            {
                _id : this._id,
                email : this.email,
                name : this.name,
                role : this.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    },
    generateRefreshToken : function(){
        return jwt.sign(
            {
                _id : this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn : process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    },
    isPasswordCorrect : async function (password) {
        if(!password || typeof password !== 'string'){
            throw new Error("Password must be a string");
        }

        return await bcryptjs.compare(password, this.password);
    },
}


export const Employee = mongoose.model("Employee", employeeSchema);



