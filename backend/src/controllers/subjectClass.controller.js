import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import Subject from "../models/subject.model.js";
import Class from "../models/class.model.js";


export const createSubjectByAdmin = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) throw new ApiError(400, "Subject name is required");


  const exists = await Subject.findOne({
    name: { $regex: `^${name.trim()}$`, $options: "i" },
  });

  if (exists) throw new ApiError(409, "Subject already exists");

  const subject = await Subject.create({
    name: name.trim(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subject, "Subject created successfully"));
});


export const getAllSubjectsByAdmin = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({}).sort({ name: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, subjects, "Subjects fetched successfully"));
});


export const deleteSubjectByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subject = await Subject.findById(id);
  if (!subject) throw new ApiError(404, "Subject not found");

  await Class.updateMany({ subjects: id }, { $pull: { subjects: id } });

  await Subject.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subject deleted successfully"));
});


export const getAllClassesWithSubjectsByAdmin = asyncHandler(async (req, res) => {
  const classes = await Class.find({})
    .populate("subjects", "name") 
    .sort({ className: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, classes, "Classes fetched successfully"));
});


export const allocateSubjectsToClassByAdmin = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { subjectIds } = req.body;

  if (!Array.isArray(subjectIds))
    throw new ApiError(400, "subjectIds must be an array");

  const cls = await Class.findById(classId);
  if (!cls) throw new ApiError(404, "Class not found");

  cls.subjects = subjectIds;
  await cls.save();

  const updated = await Class.findById(classId).populate("subjects", "name");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Subjects allocated successfully"));
});