import StudentProfile from "../models/studentProfile.model.js";
import StudentLeave from "../models/studentleave.model.js";
import TeacherProfile from "../models/teacherProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const calculateDays = (fromDate, toDate) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diff = end - start;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

  return days;
};

export const applyStudentLeave = asyncHandler(async (req, res) => {
  const campusId = req.user?.campusId;
  const studentProfile = await StudentProfile.findOne({
    user: req.user._id,
  }).select("_id");
  if (!studentProfile) throw new ApiError(401, "studentId missing in user");
  const studentId = studentProfile._id;
  const { leaveType, fromDate, toDate, reason } = req.body;
  let attachment = null;
  if (!leaveType) throw new ApiError(400, "leaveType is required");
  if (!fromDate) throw new ApiError(400, "fromDate is required");
  if (!toDate) throw new ApiError(400, "toDate is required");
  if (!reason) throw new ApiError(400, "reason is required");

  if (new Date(fromDate) > new Date(toDate)) {
    throw new ApiError(400, "fromDate cannot be greater than toDate");
  }

  const totalDays = calculateDays(fromDate, toDate);

  if (!totalDays || totalDays < 1) {
    throw new ApiError(400, "Invalid leave date range");
  }

  if (req.files?.attachment?.[0]) {
    const file = req.files.attachment[0];

    const uploaded = await uploadOnCloudinary(
      file.path,
      "schoolERP/student/leave",
    );

    if (uploaded?.secure_url) {
      attachment = uploaded.secure_url;
    }
  }
  const alreadyApplied = await StudentLeave.findOne({
    campusId,
    studentId,
    fromDate: new Date(fromDate),
    toDate: new Date(toDate),
  });

  if (alreadyApplied) {
    throw new ApiError(409, "Leave already applied for these dates");
  }

  const leave = await StudentLeave.create({
    campusId,
    studentId,
    leaveType,
    fromDate,
    toDate,
    totalDays,
    reason,
    attachment: attachment || "",

    teacherStatus: "PENDING",
    adminStatus: "NOT_REQUIRED",
    needsAdminApproval: false,
    finalStatus: "PENDING",
    approvedByRole: "NONE",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, leave, "Leave applied successfully"));
});

export const getMyStudentLeaves = asyncHandler(async (req, res) => {
  const campusId = req.user?.campusId;
  if (!campusId) throw new ApiError(401, "campusId missing in user");

  const studentProfile = await StudentProfile.findOne({
    user: req.user._id,
  }).select("_id");

  if (!studentProfile) throw new ApiError(404, "Student profile not found");

  const studentId = studentProfile._id;

  const { status } = req.query;

  const filter = {
    campusId,
    studentId,
  };

  if (status) {
    filter.finalStatus = status.toUpperCase();
  }

  const leaves = await StudentLeave.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, leaves, "My leave data fetched successfully"));
});

export const teacherGetPendingLeaves = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const teacherProfile = await TeacherProfile.findOne({
    user: userId,
  }).select("_id classTeacherOf");
  // console.log(teacherProfile);

  if (!teacherProfile) throw new ApiError(404, "Teacher profile not found");

  if (!teacherProfile.classTeacherOf) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          [],
          "You are not assigned as a class teacher for any class",
        ),
      );
  }

  const className = teacherProfile.classTeacherOf;

  const students = await StudentProfile.find({
    className,
  }).select("_id");

  const studentIds = students.map((s) => s._id);

  const leaves = await StudentLeave.find({
    studentId: { $in: studentIds },
    teacherStatus: "PENDING",
    finalStatus: "PENDING",
  })
    .populate("studentId", "name admissionNo className  rollNo")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, leaves, "Pending leaves fetched"));
});

export const teacherActionOnLeave = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const leaveId = req.params.leaveId;

  if (!userId) throw new ApiError(401, "Unauthorized");

  if (!mongoose.isValidObjectId(leaveId)) {
    throw new ApiError(400, "Invalid leaveId");
  }
  const { action, teacherRemark } = req.body;
  if (!action) throw new ApiError(400, "action is required");

  const validActions = ["APPROVE", "REJECT", "FORWARD"];
  if (!validActions.includes(action)) {
    throw new ApiError(400, "Invalid action");
  }

  const teacherProfile = await TeacherProfile.findOne({
    user: userId,
  }).select("_id classTeacherOf");

  if (!teacherProfile) throw new ApiError(404, "Teacher profile not found");

  if (!teacherProfile.classTeacherOf) {
    throw new ApiError(403, "You are not assigned as class teacher");
  }

  const leave = await StudentLeave.findOne({ _id: leaveId });

  if (!leave) throw new ApiError(404, "Leave request not found");

  if (leave.finalStatus !== "PENDING") {
    throw new ApiError(400, "This leave is already closed");
  }

  if (leave.teacherStatus !== "PENDING") {
    throw new ApiError(400, "Teacher action already taken");
  }

  const student = await StudentProfile.findOne({
    _id: leave.studentId,
  }).select("_id className");

  if (!student) throw new ApiError(404, "Student not found");

  if (String(student.className) !== String(teacherProfile.classTeacherOf)) {
    throw new ApiError(403, "You can only act on your class students leaves");
  }

  if (action === "APPROVE") {
    leave.teacherStatus = "APPROVED";
    leave.teacherRemark = teacherRemark || "";
    leave.teacherActionBy = userId;
    leave.teacherActionAt = new Date();

    leave.needsAdminApproval = false;
    leave.adminStatus = "NOT_REQUIRED";

    leave.finalStatus = "APPROVED";
    leave.approvedByRole = "TEACHER";
  }

  if (action === "REJECT") {
    if (!teacherRemark || !teacherRemark.trim()) {
      throw new ApiError(400, "teacherRemark is required for rejection");
    }

    leave.teacherStatus = "REJECTED";
    leave.teacherRemark = teacherRemark;
    leave.teacherActionBy = userId;
    leave.teacherActionAt = new Date();

    leave.needsAdminApproval = false;
    leave.adminStatus = "NOT_REQUIRED";

    leave.finalStatus = "REJECTED";
    leave.approvedByRole = "TEACHER";
  }

  if (action === "FORWARD") {
    leave.teacherStatus = "FORWARD";
    leave.teacherRemark = teacherRemark || "";
    leave.teacherActionBy = userId;
    leave.teacherActionAt = new Date();

    leave.needsAdminApproval = true;
    leave.adminStatus = "PENDING";

    leave.finalStatus = "PENDING";
    leave.approvedByRole = "NONE";
  }

  await leave.save();

  return res
    .status(200)
    .json(new ApiResponse(200, leave, `Leave ${action} successfully`));
});
