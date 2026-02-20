import TimeTable from "../models/timeTable.model.js";
import SubjectTeacher from "../models/subjectTeacher.model.js";
import Class from "../models/class.model.js";
import SubjectPeriodPlan from "../models/subjectPeriod.models.js";
import StudentPorfile from "../models/studentProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getTimeTable = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  if (!classId) {
    throw new ApiError(400, "classId required");
  }

  const data = await TimeTable.find({ classId })
    .populate("subjectId", "name")
    .populate({
      path: "teacherId",
      select: "department user",
      populate: { path: "user", select: "name email" },
    })
    .sort({ day: 1, periodNo: 1 });

  return res.json(new ApiResponse(200, data, "Timetable fetched"));
});

export const saveTimeTableCell = asyncHandler(async (req, res) => {
  const { classId, day, periodNo, subjectId } = req.body;

  if (!classId || !day || !periodNo || !subjectId) {
    throw new ApiError(
      400,
      "classId, sectionId, day, periodNo, subjectId required",
    );
  }

  // 1) Get allocated teacher for this subject in this class
  const allocation = await SubjectTeacher.findOne({ classId, subjectId });

  if (!allocation?.teacherId) {
    throw new ApiError(400, "No teacher allocated for this subject");
  }

  const teacherId = allocation.teacherId;

  // 2) Teacher clash check
  const clash = await TimeTable.findOne({
    teacherId,
    day,
    periodNo: Number(periodNo),
    $nor: [{ classId }],
  });

  if (clash) {
    throw new ApiError(
      409,
      "Teacher clash! Teacher already assigned in another class at same time.",
    );
  }

  // 3) Save cell (upsert)
  const cell = await TimeTable.findOneAndUpdate(
    { classId, day, periodNo: Number(periodNo) },
    { $set: { classId, day, periodNo, subjectId, teacherId } },
    { upsert: true, new: true, runValidators: true },
  )
    .populate("subjectId", "name")
    .populate({
      path: "teacherId",
      select: "department user",
      populate: { path: "user", select: "name email" },
    });

  return res.json(new ApiResponse(200, cell, "Timetable cell saved"));
});

export const deleteTimeTableCell = asyncHandler(async (req, res) => {
  const { classId, day, periodNo } = req.params;

  if (!classId || !day || !periodNo) {
    throw new ApiError(400, "classId, day, periodNo required");
  }

  const deleted = await TimeTable.findOneAndDelete({
    classId,
    day,
    periodNo: Number(periodNo),
  });

  if (!deleted) throw new ApiError(404, "Cell not found");

  return res.json(new ApiResponse(200, deleted, "Cell deleted"));
});

export const clearTimeTable = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  if (!classId) {
    throw new ApiError(400, "classId and sectionId required");
  }

  const result = await TimeTable.deleteMany({ classId });

  return res.json(
    new ApiResponse(
      200,
      { deletedCount: result.deletedCount },
      "Timetable cleared",
    ),
  );
});

export const getMyClassTimeTableStudent = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const student = await StudentPorfile.findOne({ user: req.user._id });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const classDoc = await Class.findOne({
    className: String(student.className),
  });

  if (!classDoc) {
    return res.status(404).json({ message: "Class not found" });
  }

  const timetable = await TimeTable.find({
    classId: classDoc._id,
  })
    .populate("subjectId", "name")
    .populate({
      path: "teacherId",
      select: "department",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .sort({ day: 1, periodNo: 1 });

  if (!timetable.length) {
    return res.status(404).json({
      success: false,
      message: "No timetable found for your class",
    });
  }

  res.status(200).json({
    success: true,
    count: timetable.length,
    timetable,
  });
});
