import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    fileType: {
      type: String,
      enum: ["pdf", "image", "doc", "ppt", "other"],
      default: "pdf",
      index: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// helpful search index
studyMaterialSchema.index({ title: 1, subject: 1, className: 1 });

const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);
export default StudyMaterial;