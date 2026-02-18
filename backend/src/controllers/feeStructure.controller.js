import FeeStructure from "../models/feeStructure.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const upsertFeeStructure = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { className, academicYear, items } = req.body;

  if (!className || !academicYear) {
    throw new ApiError(400, "className and academicYear required");
  }

  const structure = await FeeStructure.findOneAndUpdate(
    { className, academicYear },
    {
      $set: {
        className,
        academicYear,
        items: items || [],
        isActive: true,
      },
    },
    { new: true, upsert: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, structure, "Fee structure saved"));
});

export const getFeeStructures = asyncHandler(async (req, res) => {
  const data = await FeeStructure.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, data, "Fee structures"));
});

export const getFeeStructureByClass = asyncHandler(async (req, res) => {
  const { className, academicYear } = req.params;

  const data = await FeeStructure.findOne({ className, academicYear });
  if (!data) throw new ApiError(404, "Fee structure not found");

  return res.status(200).json(new ApiResponse(200, data, "Fee structure"));
});