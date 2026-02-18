import FeeStructure from "../models/feeStructure.model.js";
import FeeInvoice from "../models/feeInvoice.model.js";
import StudentProfile from "../models/studentProfile.model.js";
import StudentFeeProfile from "../models/studentFeeProfile.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateInvoiceNo } from "../utils/feeNumber.js";

const quarterMonths = {
  Q1: ["APR", "MAY", "JUN"],
  Q2: ["JUL", "AUG", "SEP"],
  Q3: ["OCT", "NOV", "DEC"],
  Q4: ["JAN", "FEB", "MAR"],
};

function computeQuarterAmount(items, quarter, includeYearlyInQ1 = true) {
  const breakdown = [];

  for (const item of items) {
    if (item.type === "MONTHLY") {
      breakdown.push({
        name: `${item.name} (3 Months)`,
        amount: item.amount * 3,
      });
    }

    if (item.type === "QUARTERLY") {
      breakdown.push({ name: item.name, amount: item.amount });
    }

    if (item.type === "ONE_TIME") {
      // Usually only in Q1
      if (quarter === "Q1") breakdown.push({ name: item.name, amount: item.amount });
    }

    if (item.type === "YEARLY") {
      if (includeYearlyInQ1 && quarter === "Q1") {
        breakdown.push({ name: item.name, amount: item.amount });
      }
    }
  }

  const total = breakdown.reduce((sum, x) => sum + x.amount, 0);
  return { breakdown, total };
}


export const generateQuarterInvoices = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  const { className, academicYear, quarter, dueDate, includeYearlyInQ1 } =
    req.body;

  if (!className || !academicYear || !quarter || !dueDate) {
    throw new ApiError(
      400,
      "className, academicYear, quarter, dueDate required"
    );
  }

  const classNum = Number(className);
  if (Number.isNaN(classNum)) throw new ApiError(400, "Invalid className");

  if (!["Q1", "Q2", "Q3", "Q4"].includes(quarter)) {
    throw new ApiError(400, "Invalid quarter");
  }

  const structure = await FeeStructure.findOne({
    className: classNum,
    academicYear,
    isActive: true,
  });

  if (!structure)
    throw new ApiError(404, "Fee structure not found for this class");

  const students = await StudentProfile.find({
    className: classNum,
    isActive: true,
  }).select("_id className");

  if (!students.length)
    throw new ApiError(404, "No students found in this class");

  const created = [];
  const skipped = [];

  for (const st of students) {
    const exists = await FeeInvoice.findOne({
      studentId: st._id,
      academicYear,
      quarter,
    });

    if (exists) {
      skipped.push(st._id);
      continue;
    }

    const feeProfile = await StudentFeeProfile.findOne({
      studentId: st._id,
    });

    const { breakdown, total } = computeQuarterAmount(
      structure.items,
      quarter,
      includeYearlyInQ1 !== false
    );

    const discountPercent = feeProfile?.discountPercent || 0;
    const discountAmount = Math.round((total * discountPercent) / 100);

    const finalTotal = total - discountAmount;

    const finalBreakdown = [...breakdown];

    if (discountAmount > 0) {
      finalBreakdown.push({
        name: `Discount (${discountPercent}%)`,
        amount: -discountAmount,
      });
    }

    const invoice = await FeeInvoice.create({
      invoiceNo: generateInvoiceNo(),
      studentId: st._id,
      className: classNum,
      academicYear,
      quarter,
      months: quarterMonths[quarter],
      feeBreakdown: finalBreakdown,
      totalAmount: finalTotal,
      paidAmount: 0,
      dueAmount: finalTotal,
      status: "DUE",
      dueDate: new Date(dueDate),
      generatedBy: userId,
    });

    created.push(invoice);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        createdCount: created.length,
        skippedCount: skipped.length,
        created,
        skipped,
      },
      "Quarter invoices generated"
    )
  );
});

/****************************************************** */


export const adminGetAllInvoices = asyncHandler(async (req, res) => {
  const campusId = req.user?.campusId;
  if (!campusId) throw new ApiError(400, "campusId missing in user");
  const {
    academicYear,
    className,
    quarter,
    status,
    search,
    page = 1,
    limit = 20,
  } = req.query;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const matchStage = { campusId };

  if (academicYear) matchStage.academicYear = academicYear;
  if (quarter) matchStage.quarter = quarter;
  if (status) matchStage.status = status;

  if (className) {
    const classNum = Number(className);
    matchStage.className = Number.isNaN(classNum) ? className : classNum;
  }

  const pipeline = [
    { $match: matchStage },

    // join student
    {
      $lookup: {
        from: "studentprofiles",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
  ];

  // 🔍 search in student + invoiceNo
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { invoiceNo: { $regex: search, $options: "i" } },
          { "student.studentName": { $regex: search, $options: "i" } },
          { "student.rollNo": { $regex: search, $options: "i" } },
          { "student.admissionNumber": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  pipeline.push(
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        invoices: [
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              invoiceNo: 1,
              campusId: 1,
              studentId: 1,
              className: 1,
              academicYear: 1,
              quarter: 1,
              months: 1,
              feeBreakdown: 1,
              totalAmount: 1,
              paidAmount: 1,
              dueAmount: 1,
              status: 1,
              dueDate: 1,
              generatedBy: 1,
              createdAt: 1,
              updatedAt: 1,

              student: {
                studentName: "$student.studentName",
                rollNo: "$student.rollNo",
                className: "$student.className",
                admissionNumber: "$student.admissionNumber",
              },
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    }
  );

  const result = await FeeInvoice.aggregate(pipeline);

  const invoices = result?.[0]?.invoices || [];
  const total = result?.[0]?.total?.[0]?.count || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page: pageNum,
        limit: limitNum,
        invoices,
      },
      "All invoices"
    )
  );
});



export const adminGetDefaulters = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const now = new Date();

  const { page = 1, limit = 50, className, search } = req.query;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const query = {
    dueAmount: { $gt: 0 },
    dueDate: { $lt: now },
  };

  if (className) {
    const classNum = Number(className);
    query.className = Number.isNaN(classNum) ? className : classNum;
  }

  await FeeInvoice.updateMany(query, { $set: { status: "OVERDUE" } });

  const invoices = await FeeInvoice.find(query)
    .populate("studentId", "name email") // ✅ User fields
    .sort({ dueDate: 1 })
    .skip(skip)
    .limit(limitNum);

  const userIds = invoices
    .map((x) => x.studentId?._id)
    .filter(Boolean);

  const profiles = await StudentProfile.find({ user: { $in: userIds } }).select(
    "userId admissionNumber rollNo  className"
  );

  const profileMap = new Map();
  profiles.forEach((p) => profileMap.set(String(p.userId), p));

  let defaulters = invoices.map((inv) => {
    const uId = inv.studentId?._id ? String(inv.studentId._id) : null;

    return {
      ...inv.toObject(),
      studentProfile: uId ? profileMap.get(uId) || null : null,
    };
  });

  if (search) {
    const s = String(search).toLowerCase().trim();

    defaulters = defaulters.filter((inv) => {
      const userName = inv?.studentId?.name || "";
      const userEmail = inv?.studentId?.email || "";
      const admission = inv?.studentProfile?.admissionNumber || "";
      const roll = inv?.studentProfile?.rollNo || "";
      const invoiceNo = inv?.invoiceNo || "";

      return (
        userName.toLowerCase().includes(s) ||
        userEmail.toLowerCase().includes(s) ||
        String(admission).toLowerCase().includes(s) ||
        String(roll).toLowerCase().includes(s) ||
        invoiceNo.toLowerCase().includes(s)
      );
    });
  }

  const total = await FeeInvoice.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page: pageNum,
        limit: limitNum,
        defaulters,
      },
      "Defaulters list"
    )
  );
});



export const studentGetMyInvoices = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const studentProfile = await StudentProfile.findOne({ user: userId }).select("_id");
  if (!studentProfile) throw new ApiError(404, "Student profile not found");
  
  const studentId = studentProfile._id;


  const data = await FeeInvoice.find({ studentId }).sort({ createdAt: -1 });

  // auto mark overdue
  const now = new Date();
  for (const inv of data) {
    if (inv.dueAmount > 0 && inv.dueDate < now && inv.status !== "OVERDUE") {
      inv.status = "OVERDUE";
      await inv.save();
    }
  }

  return res.status(200).json(new ApiResponse(200, data, "My invoices"));
});