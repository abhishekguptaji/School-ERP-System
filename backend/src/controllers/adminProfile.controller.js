import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const adminProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access only");
  }

  const adminData = await User.findOne({ role: "admin" })
    .select("-password")
    .lean();
  // console.log(adminData);  

  if (!adminData) {
    throw new ApiError(404, "Admin not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, adminData, "Admin profile fetched"));
});

export { 
  adminProfile 
};
