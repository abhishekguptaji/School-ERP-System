import mongoose from "mongoose";

const timeTableSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    periodNo: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },
  },
  { timestamps: true },
);

// one cell unique
timeTableSchema.index(
  { classId: 1, sectionId: 1, day: 1, periodNo: 1 },
  { unique: true },
);

timeTableSchema.index({ teacherId: 1, day: 1, periodNo: 1 });

const TimeTable = mongoose.model("TimeTable", timeTableSchema);

export default TimeTable;
