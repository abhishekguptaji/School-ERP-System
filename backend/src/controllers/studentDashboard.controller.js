import StudentProfile from "../models/studentProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getStudentData = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const profile = await StudentProfile.findOne({ user: userId })
    .select("userImage admissionNumber father.phone ")
    .populate("user", "name email rollNumber");

  if (!profile) {
    throw new ApiError(404, "Student profile not found");
  }
  return res.status(200).json(new ApiResponse(200, profile, "Find data"));
});

export { getStudentData };
