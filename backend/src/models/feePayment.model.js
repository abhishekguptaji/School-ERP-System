import mongoose from "mongoose";

const feePaymentSchema = new mongoose.Schema(
  {
    receiptNo: { type: String, required: true, unique: true, index: true },

    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeInvoice",
      required: true,
      index: true,
    },
    campusId: {
      type: String,
       default: "SVM-0000",
    },

    paidAmount: { type: Number, required: true, min: 1 },

    mode: {
      type: String,
      enum: ["Cash", "UPI", "Card", "NetBanking"],
      default: "Cash",
    },

    collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    note: { type: String, default: "" },

    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const FeePayment = mongoose.model("FeePayment", feePaymentSchema);
export default FeePayment;