import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      index: true,
    },
    section: {
      type: String,
      required: true,
      uppercase: true,
      enum: ["A", "B"],
      index: true,
    },

    academicYear: {
      type: String,
      required: true, 
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

/* Prevent duplicate classes */
classSchema.index(
  { className: 1, section: 1, academicYear: 1 },
  { unique: true },
);

const Class = mongoose.model("Class", classSchema);
export default Class;
