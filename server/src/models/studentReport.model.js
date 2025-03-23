import mongoose, { Schema } from "mongoose";

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

studentReportSchema.pre("save", function (next) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const quarter = `Q${Math.ceil((currentDate.getMonth() + 1) / 3)}`;

    this.reportDetails = {
        reportYear: year,
        reportDate: currentDate,
        reportQuarter: quarter
    };

    if (this.programFeedback?.programSkillsFeedback?.length) {
        const totalScore = this.programFeedback.programSkillsFeedback.reduce(
            (acc, skill) => acc + skill.skillScore, 0
        );
        this.overallScore = totalScore / this.programFeedback.programSkillsFeedback.length;
    } else {
        this.overallScore = 0;
    }

    next();
});




export const studentReport = mongoose.model("studentReport", studentReportSchema);


