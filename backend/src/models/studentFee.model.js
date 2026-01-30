import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: Number,
    date: { type: Date, default: Date.now },
    mode: {
      type: String,
      enum: ["Cash", "Online", "UPI", "Bank"],
    },
    receiptNo: String,
  },
  { _id: false }
);

const studentFeeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
      index: true,
    },

    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeStructure",
      required: true,
    },

    totalFee: Number,
    paidAmount: { type: Number, default: 0 },
    dueAmount: Number,

    payments: [paymentSchema],

    status: {
      type: String,
      enum: ["Paid", "Partial", "Due"],
      default: "Due",
    },
  },
  { timestamps: true, versionKey: false }
);

const StudentFee =  mongoose.model("StudentFee", studentFeeSchema);


export default StudentFee;


