import { asyncHandler } from "../utils/asyncHandler.js";
import Attendance from "../models/attendence.model.js";
import TeacherProfile from "../models/teacherProfile.model.js";
import StudentProfile from "../models/studentProfile.model.js";
import Class from "../models/class.model.js";
import { ApiError } from "../utils/ApiError.js";

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
    { new: true, upsert: true },
  );

  res.status(200).json({
    success: true,
    message: "Attendance saved successfully",
    data: attendance,
  });
});

export const getMyStudentByClasses = asyncHandler(async (req, res) => {
  const teacher = await TeacherProfile.findOne({ user: req.user._id }).select(
    "_id classTeacherOf",
  );

  if (!teacher) {
    throw new ApiError(404, "Teacher profile not found");
  }
   if (!teacher.classTeacherOf) {
    throw new ApiError(403, "You are not assigned as a class teacher");
  }
  const studentsOfClass = await StudentProfile.find({
    className: teacher.classTeacherOf,
  })
    .populate("user", "name email campusId")
    .select("admissionNumber user")
    .sort({ admissionNumber: 1 });;

  if (studentsOfClass.length === 0) throw new ApiError(404, "Student is Not in Your Class");
   
  res.status(200).json({
    success:true,
    message:"Student Are Found Successfully",
    totalStudents: studentsOfClass.length,
    data: studentsOfClass
  });
});

export const markAttendance = asyncHandler(async (req, res) => {
  const teacher = await TeacherProfile.findOne({ user: req.user._id });

  if (!teacher || !teacher.classTeacherOf) {
    throw new ApiError(403, "Only class teacher can mark attendance");
  }

  const { date, students } = req.body;

  if (!date || !students || students.length === 0) {
    throw new ApiError(400, "Date and students are required");
  }

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  const alreadyMarked = await Attendance.findOne({
    classId: teacher.classTeacherOf,
    date: dateOnly,
  });

  if (alreadyMarked) {
    throw new ApiError(400, "Attendance already marked for this date");
  }

  const attendance = await Attendance.create({
    classId: teacher.classTeacherOf, 
    date: dateOnly,
    students, 
  });

  res.status(201).json({
    success: true,
    message: "Attendance marked successfully",
    data: attendance,
  });
});

