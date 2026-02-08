import mongoose from "mongoose";

const applyFormSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    formType: {
      type: String,
      required: true,
      enum: [
        "LEAVE",
        "BONAFIDE",
        "TC",
        "CHARACTER_CERTIFICATE",
        "FEE_CONCESSION",
        "TRANSPORT",
        "SUBJECT_CHANGE",
        "COMPLAINT",
        "OTHER",
      ],
    },

    applyDate: {
      type: String, 
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    attachment: {
      type: String, 
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ApplyForm = mongoose.model("ApplyForm", applyFormSchema);
export default ApplyForm;
