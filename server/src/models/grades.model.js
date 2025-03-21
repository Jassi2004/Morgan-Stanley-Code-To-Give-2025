import mongoose from "mongoose";

const gradesSchema = new mongoose.Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },

    educator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },

    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
        required: true,
    },

    overallRating: {
        type: Number,
        required: true,
        min: [1, "Rating must be atleast 1"],
        max: [5, "Rating can be at most 5"],
    },

    skillRating: {
        type: Map,
        of: Number,
        default: {},
    },

    feedback : {
        type: String,
        maxLength: 500
    },

    date:{
        type: Date,
        default: ()=> Date.now(),
        required: true,
    }

}, {timestamps: true});

export const Grade = mongoose.model("Grade", gradesSchema);