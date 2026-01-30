import StudentFee from "../models/StudentFee.js";
import FeeStructure from "../models/FeeStructure.js";


const assignFeeToStudent = async (req, res) => {
  try {
    const { studentId, feeStructureId } = req.body;

    const feeStructure = await FeeStructure.findById(feeStructureId);
    if (!feeStructure) {
      return res.status(404).json({ message: "Fee structure not found" });
    }

    const studentFee = await StudentFee.create({
      student: studentId,
      feeStructure: feeStructureId,
      totalFee: feeStructure.totalFee,
      paidAmount: 0,
      dueAmount: feeStructure.totalFee,
    });

    res.status(201).json({
      success: true,
      message: "Fee assigned to student",
      data: studentFee,
    });
  } catch (error) {
    res.status(500).json({ message: "Fee assignment failed" });
  }
};

const payFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, mode, receiptNo } = req.body;

    const studentFee = await StudentFee.findById(id);
    if (!studentFee) {
      return res.status(404).json({ message: "Student fee record not found" });
    }

    studentFee.payments.push({ amount, mode, receiptNo });
    studentFee.paidAmount += amount;
    studentFee.dueAmount = studentFee.totalFee - studentFee.paidAmount;

    studentFee.status =
      studentFee.dueAmount === 0 ? "Paid" : "Partial";

    await studentFee.save();

    res.status(200).json({
      success: true,
      message: "Fee payment recorded",
      data: studentFee,
    });
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
};

const getMyFeeStatus = async (req, res) => {
  try {
    const studentId = req.user.profileId;

    const fee = await StudentFee.findOne({ student: studentId })
      .populate("feeStructure");

    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch fee status" });
  }
};


export {
  assignFeeToStudent,
  payFee,
  getMyFeeStatus
}