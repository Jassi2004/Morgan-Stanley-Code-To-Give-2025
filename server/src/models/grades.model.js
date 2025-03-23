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
        type : String,
        required : [true, "Program is required"]
    },

    marks : {
        type: Number,
        required: true,
        min: [1, "Rating must be atleast 1"],
        max: [5, "Rating can be at most 5"],
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