import asyncHandler from "express-async-handler";
import Attendance from "../models/attendance.model.js";
import Class from "../models/class.model.js";
import ApiError from "../utils/ApiError.js";

export const createOrUpdateAttendance = asyncHandler(async (req, res) => {
  const teacherId = req.user?._id;
  const { classId, date, students } = req.body;

  if (!teacherId) throw new ApiError(401, "Unauthorized");
  if (!classId || !date || !students)
    throw new ApiError(400, "Missing required fields");

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const classData = await Class.findById(classId);
  if (!classData) throw new ApiError(404, "Class not found");

  if (classData.classTeacher?.toString() !== teacherId.toString()) {
    throw new ApiError(403, "Only class teacher can mark attendance");
  }

  const existing = await Attendance.findOne({
    classId,
    date: attendanceDate,
  });

  if (existing && existing.isFinalized) {
    throw new ApiError(400, "Attendance already finalized");
  }

  const attendance = await Attendance.findOneAndUpdate(
    { classId, date: attendanceDate },
    {
      classId,
      classTeacherOf: teacherId,
      date: attendanceDate,
      students,
    },
    { new: true, upsert: true }
  );

  res.status(200).json({
    success: true,
    message: "Attendance saved successfully",
    data: attendance,
  });
});


