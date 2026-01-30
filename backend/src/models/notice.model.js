import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    fileName: String,
    fileUrl: String,        // stored file path / cloud URL
    fileType: String,       // pdf, image, docx
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
    },

    category: {
      type: String,
      enum: ["Academic", "General", "Exam", "Holiday", "Fee"],
      required: true,
      index: true,
    },

    audience: {
      type: String,
      enum: ["Student", "Teacher", "Both"],
      required: true,
      index: true,
    },

    attachments: [attachmentSchema],

    visibleFrom: {
      type: Date,
      default: Date.now,
      index: true,
    },

    visibleTill: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Notice", noticeSchema);
