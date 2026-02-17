import SubjectPeriodPlan from "../models/subjectPeriod.models.js";
import Class from "../models/class.model.js";
import Subject from "../models/subject.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



export const getSubjectPeriodPlansByClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  if (!classId) throw new ApiError(400, "classId required");

  const plans = await SubjectPeriodPlan.find({ classId })
    .populate("subjectId", "name")
    .sort({ createdAt: 1 });

  return res.json(new ApiResponse(200, plans, "Subject period plans fetched"));
});

// ===============================
// ADMIN: Delete One Plan
// ===============================
export const deleteSubjectPeriodPlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;

  const deleted = await SubjectPeriodPlan.findByIdAndDelete(planId);

  if (!deleted) throw new ApiError(404, "Plan not found");

  return res.json(new ApiResponse(200, deleted, "Plan deleted"));
});

// ===============================
// ADMIN: Bulk Save (Best for UI)
// ===============================
export const bulkUpsertSubjectPeriodPlans = asyncHandler(async (req, res) => {
  const { classId, plans } = req.body;

  if (!classId) throw new ApiError(400, "classId required");
  if (!Array.isArray(plans) || plans.length === 0) {
    throw new ApiError(400, "plans array required");
  }

  // Validate all first
  for (const p of plans) {
    if (!p.subjectId || p.periodsPerWeek === undefined) {
      throw new ApiError(400, "Each plan must contain subjectId and periodsPerWeek");
    }
    if (typeof p.periodsPerWeek !== "number") {
      throw new ApiError(400, "periodsPerWeek must be a number");
    }
    if (p.periodsPerWeek < 1 || p.periodsPerWeek > 15) {
      throw new ApiError(400, "periodsPerWeek must be between 1 and 15");
    }
  }

  // Bulk operations
  const ops = plans.map((p) => ({
    updateOne: {
      filter: { classId, subjectId: p.subjectId },
      update: { $set: { classId, subjectId: p.subjectId, periodsPerWeek: p.periodsPerWeek } },
      upsert: true,
    },
  }));

  await SubjectPeriodPlan.bulkWrite(ops);

  const updated = await SubjectPeriodPlan.find({ classId })
    .populate("subjectId", "name")
    .sort({ createdAt: 1 });

  return res.json(new ApiResponse(200, updated, "Plans saved successfully"));
});

export {
  upsertSubjectPeriodPlan
}