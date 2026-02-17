import SubjectTeacher from "../models/subjectTeacher.model.js";
import SubjectPeriodPlan from "../models/subjectPeriod.models.js";
import Class from "../models/class.model.js";
import Subject from "../models/subject.model.js";
import TeacherProfile from "../models/teacherProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const allocateTeacherToSubject = asyncHandler(async (req, res) => {
  const { classId, subjectId, teacherId, periodsPerWeek } = req.body;

   if (!classId || !subjectId || !teacherId || periodsPerWeek === undefined) {
    throw new ApiError(
      400,
      "classId, subjectId, teacherId, periodsPerWeek required"
    );
  }

  const periods = Number(periodsPerWeek);
  if (Number.isNaN(periods)) throw new ApiError(400, "periodsPerWeek must be a number");

  const allocation = await SubjectTeacher.findOneAndUpdate(
    { classId, subjectId },
    { $set: { classId, subjectId, teacherId } },
    { upsert: true, new: true, runValidators: true }
  );

  const plan = await SubjectPeriodPlan.findOneAndUpdate(
    { classId, subjectId },
    { $set: { classId, subjectId, teacherId, periodsPerWeek: periods } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return res.json(
    new ApiResponse(200, {allocation,plan}, "Teacher allocated successfully")
  );
});

export const getAllocatedTeachers = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  if (!classId) throw new ApiError(400, "classId required");

  const allocations = await SubjectTeacher.find({ classId })
    .populate("subjectId", "name subjectName")
    .populate({
      path: "teacherId",
      select: "department user",
      populate: {
        path: "user",
        select: "name email",
      },
    });

  const plans = await SubjectPeriodPlan.find({ classId }).select(
    "subjectId periodsPerWeek"
  );

  const planMap = {};
  for (const p of plans) {
    planMap[p.subjectId.toString()] = p.periodsPerWeek;
  }

  const final = allocations.map((a) => ({
    _id: a._id,
    classId: a.classId,
    subjectId: a.subjectId,
    teacherId: a.teacherId,
    periodsPerWeek: planMap[a.subjectId?._id?.toString()] || 0,
  }));

  return res.json(new ApiResponse(200, final, "Allocations fetched"));
});

export const deleteTeacherSubjectAllocation = asyncHandler(async (req, res) => {
  const { classId, subjectId } = req.params;

  if (!classId || !subjectId) {
    throw new ApiError(400, "classId and subjectId required");
  }

  const allocation = await SubjectTeacher.findOneAndDelete({ classId, subjectId });
  const plan = await SubjectPeriodPlan.findOneAndDelete({ classId, subjectId });

  // If both missing
  if (!allocation && !plan) {
    throw new ApiError(404, "Allocation not found");
  }

  return res.json(
    new ApiResponse(
      200,
      { allocationDeleted: !!allocation, planDeleted: !!plan },
      "Allocation removed successfully"
    )
  );
});

export const getSubjectsByClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  if (!classId) throw new ApiError(400, "classId required");

  const cls = await Class.findById(classId).select("subjects className");

  if (!cls) throw new ApiError(404, "Class not found");

  if (!cls.subjects || cls.subjects.length === 0) {
    return res.json(new ApiResponse(200, [], "No subjects found for this class"));
  }

  const subjects = await Subject.find({ _id: { $in: cls.subjects } })
    .select("_id name subjectName code") // keep both because your DB may have either
    .sort({ name: 1, subjectName: 1 });

  return res.json(new ApiResponse(200, subjects, "Class subjects fetched"));
});













export const getAllTeachersTimeTable = asyncHandler(async (req, res) => {
  const teachers = await TeacherProfile.find()
    .sort({ createdAt: -1 })
    .select("department user") 
    .populate("user", "name email")
    .lean();

  return res.json(new ApiResponse(200, teachers, "All teachers fetched"));
});

export const getAllClassesSubjectTimeTable = asyncHandler(async (req, res) => {
  const classes = await Class.find()
    .sort({ createdAt: -1 })
    .select("className subjects")
    .lean();

  return res.json(new ApiResponse(200, classes, "All classes fetched"));
});

