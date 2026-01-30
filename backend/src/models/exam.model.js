import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Midterm, Final
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
    },

    totalMarks: {
      type: Number,
      default: 100,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

const Exam = mongoose.model("Exam", examSchema);
export default Exam;
