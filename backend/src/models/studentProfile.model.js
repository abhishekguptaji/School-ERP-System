import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    userImage: {
      type: String,
      required: true,
      trim: true,
    },
    fatherImage: {
      type: String,
      required: true,
      trim: true,
    },
    motherImage: {
      type: String,
      required: true,
      trim: true,
    },
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    className: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    rollNo :{
       type:Number,
       required:true,
    },
    section: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
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
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    address: {
      city: String,
      state: String,
      pincode: {
        type: String,
        match: [/^[0-9]{6}$/, "Invalid pincode"],
      },
    },
    father: {
      name: { type: String, required: true },
      phone: {
        type: String,
        required: true,
        match: [/^[6-9]\d{9}$/, "Invalid phone number"],
      },
      occupation: String,
    },
    mother: {
      name: { type: String, required: true },
      phone: {
        type: String,
        match: [/^[6-9]\d{9}$/, "Invalid phone number"],
      },
      occupation: String,
    },
    guardian: {
      name: {
        type: String,
        trim: true,
      },
      relation: String,
      phone: {
        type: String,
        match: [/^[6-9]\d{9}$/, "Invalid phone number"],
      },
    },
    documents: {
      aadhaarNumber: {
        type: String,
        match: [/^[0-9]{12}$/, "Invalid Aadhaar number"],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);
studentProfileSchema.index({ class: 1, section: 1 });
studentProfileSchema.index({ academicYear: 1 });

studentProfileSchema.virtual("studentAge").get(function () {
  if (!this.dob) return null;
  const diff = Date.now() - this.dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

studentProfileSchema.set("toJSON", { virtuals: true });
studentProfileSchema.set("toObject", { virtuals: true });

studentProfileSchema.plugin(aggregatePaginate);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

export default StudentProfile;
