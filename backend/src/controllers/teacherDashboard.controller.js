import TeacherProfile from "../models/teacherProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getTeacherProfileShort = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const profile = await TeacherProfile.findOne({
    user: userId,
  })
    .select("teacherImage designation")
    .populate("user", "name email campusId");

  if (!profile) {
    throw new ApiError(404, "Teacher profile not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Find Data Successfully"));
});

export { getTeacherProfileShort };
