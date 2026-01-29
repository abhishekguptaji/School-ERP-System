import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    /* ===== USER LINK ===== */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /* ===== SCHOOL INFO ===== */
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    class: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
      uppercase: true,
    },

    academicYear: {
      type: String,
      required: true,
    },

    /* ===== PERSONAL ===== */
    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    bloodGroup: {
      type: String,
    },

    /* ===== ADDRESS ===== */
    address: {
      city: String,
      state: String,
      pincode: String,
    },

    /* ===== PARENTS ===== */
    father: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      occupation: String,
    },

    mother: {
      name: { type: String, required: true },
      phone: String,
      occupation: String,
    },

    guardian: {
      name: String,
      relation: String,
      phone: String,
    },

    /* ===== DOCUMENTS ===== */
    documents: {
      aadhaarNumber: String,
      photo: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

/* INDEXES */
studentProfileSchema.index({ admissionNumber: 1 });
studentProfileSchema.index({ class: 1, section: 1 });

const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);

export default StudentProfile;
