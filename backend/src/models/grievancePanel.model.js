import mongoose from "mongoose";
import Counter from "./counter.model.js";

const grievanceReplySchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 2000,
    },
  },
  { timestamps: true },
);

const grievancePanelSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 5000,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "fees",
        "exam",
        "teacher",
        "bullying",
        "transport",
        "library",
        "facility",
        "technical",
        "other",
      ],
      default: "other",
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "rejected", "closed"],
      default: "pending",
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    createdByRole: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    attachment: {
      fileUrl: { type: String, default: "" },
      fileType: {
        type: String,
        enum: ["image", "pdf", "doc", "other"],
        default: "other",
      },
      publicId: { type: String, default: "" },
    },

    replies: {
      type: [grievanceReplySchema],
      default: [],
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

grievancePanelSchema.pre("save", async function () {
  if (!this.ticketId) {
    const counter = await Counter.findOneAndUpdate(
      { name: "ticketId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    const padded = String(counter.seq).padStart(4, "0");
    this.ticketId = `GriT-${padded}`;
  }
});

grievancePanelSchema.index({ createdBy: 1, status: 1 });
grievancePanelSchema.index({ category: 1, priority: 1, status: 1 });

const GrievancePanel = mongoose.model("GrievancePanel", grievancePanelSchema);

export default GrievancePanel;
