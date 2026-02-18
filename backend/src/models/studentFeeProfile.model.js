import mongoose from "mongoose";

const studentFeeProfileSchema = new mongoose.Schema(
  {
    campusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
      unique: true,
      index: true,
    },

    discountPercent: { type: Number, default: 0, min: 0, max: 100 },

    transportEnabled: { type: Boolean, default: false },
    hostelEnabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const StudentFeeProfile = mongoose.model(
  "StudentFeeProfile",
  studentFeeProfileSchema,
);
export default StudentFeeProfile;
