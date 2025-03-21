import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description:{
    type: String, 
    maxLength: 1000,
    trim: true,
  },
  ageGroup:{
    type: String,
    required: true,
    trim: true,
  },
  skillAreas: {
    type: [String],
    required: true,
  }
});

export const Program = mongoose.model("Program", programSchema);
