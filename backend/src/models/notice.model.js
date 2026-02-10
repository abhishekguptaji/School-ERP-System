import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    fileName: String,
    fileUrl: String,
    fileType: String,
  },
  { _id: false }
);

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      enum: ["Academic", "General", "Exam", "Holiday", "Fee"],
      required: true,
      index: true,
    },

    audience: {
      type: String,
      enum: ["All", "Teacher", "Student"],
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: ["Normal", "Important", "Urgent"],
      default: "Normal",
      index: true,
    },

    attachement: [attachmentSchema],

    publishAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    expireAt: {
      type: Date,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

const Notice = new mongoose.model("Notice", noticeSchema);

export default Notice;