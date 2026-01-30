import mongoose from "mongoose";

const subjectMarkSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    marksObtained: Number,
    maxMarks: Number,
  },
  { _id: false },
);

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    subjects: [subjectMarkSchema],

    totalObtained: Number,
    percentage: Number,
    grade: String,
  },
  { timestamps: true, versionKey: false },
);

resultSchema.index({ student: 1, exam: 1 }, { unique: true });

const Result = mongoose.model("Result", resultSchema);

export default Result;
