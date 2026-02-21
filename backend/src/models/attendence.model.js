import mongoose from "mongoose";

const attendanceStudentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      default: "Present",
    },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    classTeacherOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    students: {
      type: [attendanceStudentSchema],
      required: true,
      validate: v => Array.isArray(v) && v.length > 0,
    },

    isFinalized: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);


attendanceSchema.index(
  { classId: 1, date: 1 },
  { unique: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;