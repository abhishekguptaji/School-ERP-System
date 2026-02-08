import ApplyForm from "../models/studentApplyForm.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createApplyForm = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized User ");

  if (req.user.role !== "student") {
    throw new ApiError(403, "Only students can apply forms");
  }

  const { formType, applyDate, reason } = req.body;
  let attachment = req.body.attachment;
  
  if (!formType || !applyDate || !reason) {
    throw new ApiError(400, "formType, applyDate and reason are required");
  }

  if(req.files?.attachment?.[0]){
    const upload = await uploadOnCloudinary(
      req.files.attachment[0].path,
      "schoolERP/student/ApplyForm",
    );
    if(upload?.secure_url) attachment = upload.secure_url;
  }

  const newForm = await ApplyForm.create({
    user: userId,
    formType,
    applyDate,
    reason,
    attachment,
    status: "PENDING",
  });

  const populatedForm = await ApplyForm.findById(newForm._id).populate(
    "user",
    "name email campusId role"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedForm, "Form submitted successfully"));
});

export const getMyApplyForms = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  const forms = await ApplyForm.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("user", "name email campusId role");

  return res
    .status(200)
    .json(new ApiResponse(200, forms, "My forms fetched successfully"));
});

export const getApplyFormById = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) throw new ApiError(401, "Unauthorized");

  const form = await ApplyForm.findById(id).populate(
    "user",
    "name email campusId role"
  );

  if (!form) throw new ApiError(404, "Form not found");

  // student can see only own form
  if (req.user.role === "student") {
    if (form.user._id.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not allowed to view this form");
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, form, "Form fetched successfully"));
});


export const getAllApplyForms = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  // Only admin
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can view all forms");
  }

  const { status, formType, search } = req.query;

  let filter = {};

  if (status) filter.status = status;
  if (formType) filter.formType = formType;

  // Basic search by campusId / name / email
  // (search works only if we populate and filter manually, but we can do a simple version)
  let forms = await ApplyForm.find(filter)
    .sort({ createdAt: -1 })
    .populate("user", "name email campusId role");

  if (search) {
    const s = search.toLowerCase();
    forms = forms.filter((f) => {
      return (
        f.user?.name?.toLowerCase().includes(s) ||
        f.user?.email?.toLowerCase().includes(s) ||
        f.user?.campusId?.toLowerCase().includes(s)
      );
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, forms, "All forms fetched successfully"));
});

export const updateApplyFormStatus = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;
  const { status, remarks } = req.body;

  if (!userId) throw new ApiError(401, "Unauthorized");

  // Only admin/teacher
  if (!["admin", "teacher"].includes(req.user.role)) {
    throw new ApiError(403, "Only admin/teacher can update status");
  }

  if (!status) throw new ApiError(400, "status is required");

  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const form = await ApplyForm.findById(id);

  if (!form) throw new ApiError(404, "Form not found");

  form.status = status;
  form.remarks = remarks || "";
  form.approvedBy = userId;
  form.approvedAt = new Date();

  await form.save();

  const updatedForm = await ApplyForm.findById(id).populate(
    "user",
    "name email campusId role"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedForm, "Form status updated successfully"));
});

export const deleteMyApplyForm = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) throw new ApiError(401, "Unauthorized");

  const form = await ApplyForm.findById(id);

  if (!form) throw new ApiError(404, "Form not found");

  // Only owner can delete
  if (form.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to delete this form");
  }

  // Only pending can delete
  if (form.status !== "PENDING") {
    throw new ApiError(400, "Only pending forms can be deleted");
  }

  await ApplyForm.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Form deleted successfully"));
});

export {
  createApplyForm 
}