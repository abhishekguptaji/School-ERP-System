import mongoose from "mongoose";

const teacherProfileSchema = new mongoose.Schema(
  {
    /* ===== USER LINK ===== */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /* ===== PROFESSIONAL ===== */
    designation: {
      type: String,
      required: true,
      // PRT, TGT, PGT
    },

    department: {
      type: String,
    },

    dateOfJoining: {
      type: Date,
      required: true,
    },

    qualification: {
      type: String,
    },

    experience: {
      type: Number, // in years
      default: 0,
    },

    /* ===== TEACHING ===== */
    subjects: [String],

    classesAssigned: [
      {
        class: String,
        section: String,
      },
    ],

    /* ===== ADDRESS ===== */
    address: {
      city: String,
      state: String,
      pincode: String,
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

/* INDEX */
teacherProfileSchema.index({ department: 1 });

const TeacherProfile = mongoose.model(
  "TeacherProfile",
  teacherProfileSchema
);

export default TeacherProfile;
