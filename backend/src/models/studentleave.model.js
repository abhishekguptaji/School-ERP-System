import mongoose from "mongoose";

const studentLeaveSchema = new mongoose.Schema(
  {
    campusId: {
      type: String,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["SICK", "CASUAL", "EMERGENCY", "OTHER"],
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      default: 1,
      min: 1,
    },
    reason: {
      type: String,
      trim: true,
      required: true,
    },
    attachment: {
      type: String,
      default: "",
    },
    classTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      default: null,
    },
    teacherStatus: {
      type: String,
      enum: ["PENDING", "FORWARD", "REJECTED", "APPROVED"],
      default: "PENDING",
    },
    teacherRemark: {
      type: String,
      trim: true,
      default: "",
    },
    teacherActionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    teacherActionAt: {
      type: Date,
      default: null,
    },
    needsAdminApproval: {
      type: Boolean,
      default: false,
    },
    adminStatus: {
      type: String,
      enum: ["NOT_REQUIRED", "PENDING", "APPROVED", "REJECTED"],
      default: "NOT_REQUIRED",
    },

    adminActionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    finalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    adminActionAt: {
      type: Date,
      default: null,
    },
    approvedByRole: {
      type: String,
      enum: ["NONE", "TEACHER", "ADMIN"],
      default: "NONE",
    },
  },
  { timestamps: true },
);

studentLeaveSchema.index({ campusId: 1, studentId: 1 });
studentLeaveSchema.index({ campusId: 1, finalStatus: 1 });
studentLeaveSchema.index({ campusId: 1, teacherStatus: 1 });
studentLeaveSchema.index({ campusId: 1, adminStatus: 1 });

const StudentLeave = mongoose.model("StudentLeave", studentLeaveSchema);

export default StudentLeave;
