import mongoose, { Schema } from "mongoose";

const monthlyReportSchema = new Schema(
    {
        studentDetails: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: [true, "Student details are required"],
        },
        monthlyScore: {
            type: Number,
            required: [true, "Monthly score is required"],
            min: [1, "Score must be at least 1"],
            max: [5, "Score cannot exceed 5"],
        },
        remarks: {
            type: String,
            required: [true, "Remarks are required"],
        },
        timeFrame: {
            month: {
                type: String,
                enum: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                required: true,
            },
            year: {
                type: String,
                required: true,
            },
            quarter: {
                type: String,
                enum: ["Q1", "Q2", "Q3", "Q4"],
                default: function () {
                    return `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
                },
            },
        },
    },
    { timestamps: true }
);

export const monthlyReport = mongoose.model("monthlyReport", monthlyReportSchema);
