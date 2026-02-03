import User from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

  // Ensure admin access
  // if (!req.user || req.user.role !== "admin") {
  //   throw new ApiError(403, "Only admin can register users");
  // }

  const {name,email,rollNumber,employeeId,password,role,} = req.body;

  if (!name || !password || !role) {
    throw new ApiError(400, "Name, password and role are required");
  }

  if (!["student", "teacher"].includes(role)) {
    throw new ApiError(400, "Admin can register only student or teacher");
  }

  if (role === "student" && !rollNumber) {
    throw new ApiError(400, "Roll number is required for student");
  }

  if (role === "teacher" && !employeeId) {
    throw new ApiError(400, "Employee ID is required for teacher");
  }

  const existedUser = await User.findOne({
    $or: [
      email ? { email } : null,
      rollNumber ? { rollNumber } : null,
      employeeId ? { employeeId } : null,
    ].filter(Boolean),
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    rollNumber,
    employeeId,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Error while creating user");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      createdUser,
      `${role} registered successfully`
    )
  );
});







export { 
  registerUser,
};

