import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: { 
      type: String, 
      required: true, 
      unique: true 
    }, 
    subjects: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Subject" 
    }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Class =  mongoose.model("Class", classSchema);

export default Class;