import mongoose, { Schema } from "mongoose";
import { Grade } from "./grades.model.js";
import { monthlyReport } from "./monthlyReports.model.js";

const studentReportSchema = new Schema(
    {
        studentDetails: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: [true, "Student details are required"],
        },
        monthlyReports: [
            {
                type: Schema.Types.ObjectId,
                ref: "monthlyReport",
            }
        ],
        reportDetails: {
            reportYear: {
                type: String,
                required: [true, "Report Year is required"],
                default: () => new Date().getFullYear(),
            },
            reportDate: {
                type: Date,
                required: [true, "Report date is required"],
                default: () => new Date(),
            },
            reportQuarter: {
                type: String,
                enum: ["Q1", "Q2", "Q3", "Q4"],
                default: function () {
                    return `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
                },
            },
        },
        programFeedback: {
            programName: {
                type: String,
                enum: [
                    "Multi", "Job Readiness", "Vocation", "Spruha", "Suyog",
                    "Sameti", "Shaale", "Siddhi", "Sattva",
                ],
            },
            programSkillsFeedback: [
                {
                    skillName: {
                        type: String,
                        required: [true, "Skill name is required"],
                    },
                    skillScore: {
                        type: Number,
                        required: [true, "Skill score is required"],
                    },
                },
            ],
        },
        feedback: {
            suggestions: {
                type: String,
                required: [true, "Suggestions are required"],
            },
            teacherComments: {
                type: String,
                required: [true, "Teacher comments are required"],
            },
        },
        assessmentReport: [
            {
                type: Schema.Types.ObjectId,
                ref: "Grade",
            },
        ],
        overallScore: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// **Calculate overallScore before saving**
studentReportSchema.pre("save", async function (next) {
    try {
        let totalScore = 0;
        let count = 0;

        console.log("🔹 Running Pre-Save Hook...");

        // ✅ Step 1: Calculate Program Feedback Average
        if (this.programFeedback?.programSkillsFeedback?.length) {
            console.log("✅ Program Skills Found:", this.programFeedback.programSkillsFeedback);

            const skillTotal = this.programFeedback.programSkillsFeedback.reduce(
                (acc, skill) => acc + (skill.skillScore || 0),
                0
            );

            totalScore += skillTotal;
            count += this.programFeedback.programSkillsFeedback.length;
        }

        // ✅ Step 2: Calculate Assessment Report Average
        if (this.assessmentReport?.length) {
            const grades = await Grade.find({ _id: { $in: this.assessmentReport } }).select("marks");
            console.log("✅ Fetched Grades:", grades);

            if (grades.length > 0) {
                const gradeTotal = grades.reduce((acc, grade) => acc + (grade.marks || 0), 0);
                totalScore += gradeTotal;
                count += grades.length;
            }
        }

        // ✅ Step 3: Calculate Monthly Reports Average
        if (this.monthlyReports?.length) {
            const reports = await monthlyReport.find({ _id: { $in: this.monthlyReports } }).select("monthlyScore");
            console.log("✅ Fetched Monthly Reports:", reports);

            let monthlyTotal = 0;
            let monthlyCount = 0;

            reports.forEach((report) => {
                if (report.monthlyScore?.length) {
                    const reportScore = report.monthlyScore.reduce((acc, skill) => acc + (skill.marks || 0), 0);
                    monthlyTotal += reportScore;
                    monthlyCount += report.monthlyScore.length;
                }
            });

            if (monthlyCount > 0) {
                totalScore += monthlyTotal;
                count += monthlyCount;
            }
        }

        // ✅ Step 4: Compute Final Average
        this.overallScore = count > 0 ? totalScore / count : 0;

        console.log("🔹 Total Score:", totalScore, "Count:", count);
        console.log("✅ Calculated Overall Score:", this.overallScore);

        next();
    } catch (err) {
        console.error("❌ Error in pre-save hook:", err);
        next(err);
    }
});

export const studentReport = mongoose.model("studentReport", studentReportSchema);
