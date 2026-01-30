import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

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
      enum: ["PRT", "TGT", "PGT"],
      index: true,
    },

    department: {
      type: String,
      trim: true,
      index: true,
    },

    dateOfJoining: {
      type: Date,
      required: true,
    },

    qualification: {
      type: String,
      trim: true,
    },

    experience: {
      type: Number, // fallback/manual
      default: 0,
    },

    /* ===== TEACHING ===== */
    subjects: {
      type: [String],
      default: [],
    },

    classesAssigned: [
      {
        class: {
          type: String,
          enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        },
        section: {
          type: String,
          enum: ["A", "B"],
        },
      },
    ],

    /* ===== ADDRESS ===== */
    address: {
      city: String,
      state: String,
      pincode: {
        type: String,
        match: [/^[0-9]{6}$/, "Invalid pincode"],
      },
    },

    /* ===== DOCUMENTS ===== */
    documents: {
      aadhaarNumber: {
        type: String,
        match: [/^[0-9]{12}$/, "Invalid Aadhaar number"],
      },
      photo: String,
    },

    /* ===== STATUS ===== */
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/* ===== INDEXES ===== */
teacherProfileSchema.index({ department: 1, designation: 1 });

/* ===== VIRTUAL: SERVICE YEARS ===== */
teacherProfileSchema.virtual("serviceYears").get(function () {
  if (!this.dateOfJoining) return null;

  const diff = Date.now() - this.dateOfJoining.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

/* ===== ENABLE VIRTUALS ===== */
teacherProfileSchema.set("toJSON", { virtuals: true });
teacherProfileSchema.set("toObject", { virtuals: true });

/* ===== PAGINATION ===== */
teacherProfileSchema.plugin(aggregatePaginate);

const TeacherProfile = mongoose.model("TeacherProfile", teacherProfileSchema);

export default TeacherProfile;
