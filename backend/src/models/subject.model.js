import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true, 
      unique: true 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;