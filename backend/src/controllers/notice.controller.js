import Notice from "../models/notice.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createNotice = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized User Come..");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(401, "Only Admin and Teacher are create Notices..");
  }

  const {
    title,
    description,
    category,
    priority,
    audience,
    publishAt,
    expireAt,
  } = req.body;

  if (!title || !category || !priority || !audience) {
    throw new ApiError(400, "All Fields are required to show");
  }
  let attachement = [];

  if (req.files?.attachement?.[0]) {
    const file = req.files.attachement[0];
    const upload = await uploadOnCloudinary(
      file.path,
      "schoolERP/admin/notices",
    );
    if (upload?.secure_url) {
      attachement.push({
        fileUrl: upload.secure_url,
        fileType: file.mimetype.includes("pdf") ? "pdf" : "image",
        fileName: file.originalname || upload.public_id || "",
      });
    }
  }

  const notice = await Notice.create({
    title: title.trim(),
    description: description?.trim() || "",
    category,
    priority,
    audience,
    publishAt: publishAt || Date.now(),
    expireAt: expireAt || null,
    attachement,
    createdBy: userId,
  });

  if (!notice) throw new ApiError(500, "Notice is not created");
  return res
    .status(201)
    .json(new ApiResponse(201, notice, "Notices created Successfully.."));
});

const getAdminNotices = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only Admin can view all notices");
  }

  const notices = await Notice.find()
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notices, "Admin notices fetched successfully"));
});

const getTeacherNotice = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  if (req.user.role !== "teacher") {
    throw new ApiError(403, "Only Teachers can view these notices");
  }

  const notices = await Notice.find({
    isActive: true,
    audience: { $in: ["Teacher", "Both"] },
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, notices, "Teacher notices fetched successfully"),
    );
});

const getStudentNotice = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  if (req.user.role !== "student") {
    throw new ApiError(403, "Only Students can view these notices");
  }

  const notices = await Notice.find({
    isActive: true,
    audience: { $in: ["Student", "Both"] },
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notices, "Notices fetched successfully"));
});

const deleteNoticeByAdmin = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only Admin can delete notices");
  }

  const { id } = req.params;

  const deleted = await Notice.findByIdAndDelete(id);

  if (!deleted) {
    throw new ApiError(404, "Notice not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Notice deleted permanently"));
});

export {
  createNotice,
  getAdminNotices,
  getTeacherNotice,
  getStudentNotice,
  deleteNoticeByAdmin,
};
