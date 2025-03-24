import mongoose, { Schema } from "mongoose";

import { Grade } from "./grades.model.js";

const studentReportSchema = new Schema({
    studentDetails : {
        type : Schema.Types.ObjectId,
        ref : "Student",
        required : [true, "StudentDetails is required"]
    },
    reportDetails: {
        reportYear: {
            type: String,
            required: [true, "Report Year is required"],
            default: () => new Date().getFullYear()
        },
        reportDate: {
            type: Date,
            required: [true, "Report date is required"],
            default: () => new Date() 
        },
        reportQuarter: {
            type: String,
            enum: ["Q1", "Q2", "Q3", "Q4"],
            default: function () {
                return `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`; 
            }
        }
    },
    programFeedback : {
        programName : {
            type : String, 
            enum : ["Multi", "Job Readiness", "Vocation", "Spruha", "Suyog", "Sameti", "Shaale", "Siddhi", "Sattva"],
        },
        programSkillsFeedback : [
            {
                skillName : {
                    type : String,
                    required : [true, "skillName is required"]
                },
                skillScore : {
                    type : Number,
                    required : [true, "SkillScore is required"]
                }
            }
        ]
    },
    feedback : {
        suggestions : {
            type : String,
            required : [true, "Suggestions are required"]
        },
        teacherComments : {
            type : String,
            required : [true, "Teacher Comments are required"]
        }
    },
    assessmentReport : [
        {
            type : Schema.Types.ObjectId,
            ref : "Grade"
        }
    ],
    overallScore : {
        type : Number,
        default : 0,
    }

}, {
    timestamps : true
})

studentReportSchema.pre("save", async function (next) {
    try {
        let totalScore = 0;
        let count = 0;

        // Compute skill scores average
        if (this.programFeedback?.programSkillsFeedback?.length) {
            const skillTotal = this.programFeedback.programSkillsFeedback.reduce(
                (acc, skill) => acc + skill.skillScore,
                0
            );
            totalScore += skillTotal;
            count += this.programFeedback.programSkillsFeedback.length;
        }

        // Fetch assessment scores and compute their average
        if (this.assessmentReport?.length) {
            const grades = await Grade.find({ _id: { $in: this.assessmentReport } }).select("marks");
            if (grades.length > 0) {
                const gradeTotal = grades.reduce((acc, grade) => acc + grade.marks, 0); // Fixed variable name `acc`
                totalScore += gradeTotal;
                count += grades.length;
            }
        }

        // Compute final overallScore
        this.overallScore = count > 0 ? totalScore / count : 0;

        next();
    } catch (err) {
        next(err);
    }
});






export const studentReport = mongoose.model("studentReport", studentReportSchema);


