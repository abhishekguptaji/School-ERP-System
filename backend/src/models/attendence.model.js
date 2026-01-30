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
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    students: [attendanceStudentSchema],

    isFinalized: {
      type: Boolean,
      default: false, // once finalized cannot edit
    },
  },
  { timestamps: true, versionKey: false }
);

/* Prevent duplicate attendance */
attendanceSchema.index(
  { class: 1, subject: 1, date: 1 },
  { unique: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
