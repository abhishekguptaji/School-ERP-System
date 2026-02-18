import mongoose from "mongoose";

const breakdownSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true, 
    },
  },
  { _id: false },
);

const feeInvoiceSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    campusId: {
      type: String,
      default: "SVM-0000",
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
      index: true,
    },

    className: {
      type: Number,
      required: true,
      index: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    quarter: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4"],
      required: true,
      index: true,
    },

    months: { type: [String], default: [] },

    feeBreakdown: { type: [breakdownSchema], default: [] },

    totalAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    dueAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["DUE", "PARTIAL", "PAID", "OVERDUE"],
      default: "DUE",
      index: true,
    },

    dueDate: { type: Date, required: true },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

feeInvoiceSchema.index(
  { campusId: 1, studentId: 1, academicYear: 1, quarter: 1 },
  { unique: true },
);

const FeeInvoice = mongoose.model("FeeInvoice", feeInvoiceSchema);
export default FeeInvoice;
