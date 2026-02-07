import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    teacherImage: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "resigned", "terminated", "onLeave"],
      default: "active",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    designation: {
      type: String,
      required: true,
      enum: ["PRT", "TGT", "PGT"],
      index: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    dateOfJoining: {
      type: Date,
      required: true,
      index: true,
    },
    employmentType: {
      type: String,
      required: true,
      enum: ["Permanent", "Contract", "Guest", "Part-time"],
      default: "Permanent",
      index: true,
    },
    qualification: {
      type: String,
      trim: true,
      default: "",
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    isClassTeacher: {
      type: Boolean,
      default: false,
      index: true,
    },
    classTeacherOf: {
      type: String,
      enum:[1,2,3,4,5,6,7,8,9,10,11,12],
      trim: true,
      default: "",
    },

    /* ================= PERSONAL ================= */
    dob: {
      type: Date,
      default: null,
      index: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
      index: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      default: "O+",
    },

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      default: "Single",
    },
    
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST", "EWS", ""],
      default: "",
    },

    /* ================= CONTACT ================= */
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
      index: true,
    },

    alternatePhone: {
      type: String,
      trim: true,
      default: "",
      match: [/^$|^[6-9]\d{9}$/, "Invalid alternate phone number"],
    },

    address: {
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      pincode: {
        type: String,
        trim: true,
        default: "",
        match: [/^$|^[0-9]{6}$/, "Invalid pincode"],
      },
      fullAddress: { type: String, trim: true, default: "" },
    },

    /* ================= EMERGENCY CONTACT ================= */
    emergencyContact: {
      name: { type: String, trim: true, default: "" },
      relation: { type: String, trim: true, default: "" },
      phone: {
        type: String,
        trim: true,
        default: "",
        match: [/^$|^[6-9]\d{9}$/, "Invalid emergency contact phone number"],
      },
    },

    /* ================= DOCUMENTS ================= */
    documents: {
      aadhaarNumber: {
        type: String,
        trim: true,
        default: "",
        match: [/^$|^[0-9]{12}$/, "Invalid Aadhaar number"],
        index: true,
      },

      panNumber: {
        type: String,
        trim: true,
        default: "",
        uppercase: true,
        match: [/^$|^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"],
        index: true,
      },
    },

    /* ================= BANK DETAILS ================= */
    bankDetails: {
      accountHolderName: { type: String, trim: true, default: "" },
      accountNumber: { type: String, trim: true, default: "" },
      ifscCode: {
        type: String,
        trim: true,
        uppercase: true,
        default: "",
        match: [/^$|^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code"],
      },
      bankName: { type: String, trim: true, default: "" },
      branch: { type: String, trim: true, default: "" },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ================= INDEXES ================= */
teacherProfileSchema.index({ department: 1, designation: 1 });
teacherProfileSchema.index({ isActive: 1, status: 1 });

/* ================= VIRTUALS ================= */

// service years from dateOfJoining
teacherProfileSchema.virtual("serviceYears").get(function () {
  if (!this.dateOfJoining) return null;

  const diff = Date.now() - this.dateOfJoining.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

// teacher age from dob
teacherProfileSchema.virtual("teacherAge").get(function () {
  if (!this.dob) return null;

  const diff = Date.now() - this.dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

/* ================= ENABLE VIRTUALS ================= */
teacherProfileSchema.set("toJSON", { virtuals: true });
teacherProfileSchema.set("toObject", { virtuals: true });

/* ================= PAGINATION ================= */
teacherProfileSchema.plugin(aggregatePaginate);

const TeacherProfile = mongoose.model("TeacherProfile", teacherProfileSchema);

export default TeacherProfile;
