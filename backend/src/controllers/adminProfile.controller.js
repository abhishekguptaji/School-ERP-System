import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const adminProfile = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.user._id)
    .select("-password")
    .lean();

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }
  
  return res.status(200).json(
    new ApiResponse(200, admin, "Admin profile fetched successfully")
  );
});

export { 
  adminProfile 
};
