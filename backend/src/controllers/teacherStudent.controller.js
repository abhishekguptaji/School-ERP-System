import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import TeacherProfile from "../models/teacherProfile.model.js";
import TimeTable from "../models/timeTable.model.js";
import StudentProfile from "../models/studentProfile.model.js";

export const getMyStudentInTeacherPanel = asyncHandler(async (req, res) => {
  const teacher = await TeacherProfile.findOne({ user: req.user._id });

  if (!teacher) {
    throw new ApiError(404, "Teacher profile not found");
  }

  const allocations = await TimeTable.find({
    teacherId: teacher._id,
  })
    .populate("classId", "className")
    .populate("subjectId", "name");

  const uniqueAllocations = [];
  const map = new Set();

  for (const item of allocations) {
    const key = `${item.classId._id}-${item.subjectId._id}`;

    if (!map.has(key)) {
      map.add(key);

      const students = await StudentProfile.find({
        className: item.classId.className,
      })
        .select("_id className userImage admissionNumber dob gender bloodGroup address father")
        .populate("user", "name email campusId")
        .sort({ number: 1 });

      uniqueAllocations.push({
        classId: item.classId,
        subjectId: item.subjectId,
        students,
      });
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        uniqueAllocations,
        "Allocations with students fetched successfully",
      ),
    );
});
