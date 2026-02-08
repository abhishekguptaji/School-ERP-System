import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can register users");
  }

  if (!name || !password || !role) {
    throw new ApiError(400, "Name, password and role are required");
  }

  if (!["student", "teacher"].includes(role)) {
    throw new ApiError(400, "Admin can register only student or teacher");
  }

  if (email) {
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new ApiError(409, "User already exists with this email");
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Error while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, `${role} registered successfully`));
});

export { registerUser };
