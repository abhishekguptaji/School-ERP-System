import FeeInvoice from "../models/feeInvoice.model.js";
import FeePayment from "../models/feePayment.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateReceiptNo } from "../utils/feeNumber.js";

export const collectFee = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { invoiceId } = req.params;
  const { paidAmount, mode, note } = req.body;

  if (!paidAmount || Number(paidAmount) <= 0) {
    throw new ApiError(400, "Valid paidAmount required");
  }

  const invoice = await FeeInvoice.findById(invoiceId);
  if (!invoice) throw new ApiError(404, "Invoice not found");

  if (invoice.dueAmount <= 0) {
    throw new ApiError(400, "Invoice already paid");
  }

  if (Number(paidAmount) > invoice.dueAmount) {
    throw new ApiError(400, "Amount cannot be more than due amount");
  }

  const payment = await FeePayment.create({
    receiptNo: generateReceiptNo(),
    invoiceId: invoice._id,
    studentId: invoice.studentId,
    paidAmount: Number(paidAmount),
    mode: mode || "Cash",
    collectedBy: userId,
    note: note || "",
  });

  invoice.paidAmount += Number(paidAmount);
  invoice.dueAmount = invoice.totalAmount - invoice.paidAmount;

  if (invoice.dueAmount === 0) invoice.status = "PAID";
  else invoice.status = "PARTIAL";

  await invoice.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { invoice, payment }, "Fee collected"));
});

export const adminGetPaymentsByInvoice = asyncHandler(async (req, res) => {
  const { invoiceId } = req.params;

  const data = await FeePayment.find({ invoiceId })
    .populate("collectedBy", "fullName email")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, data, "Invoice payments"));
});

export const studentGetMyReceipts = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const data = await FeePayment.find({ studentId })
    .populate("invoiceId", "invoiceNo quarter academicYear totalAmount")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, data, "My receipts"));
});