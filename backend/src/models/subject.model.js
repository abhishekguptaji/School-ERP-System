import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    code: {
      type: String,
      trim: true, // optional (e.g. MTH-10)
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

subjectSchema.index({ name: 1, class: 1 }, { unique: true });

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
