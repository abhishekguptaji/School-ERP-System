import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const uploadStudyMaterialTeacher = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "teacher")
    throw new ApiError(403, "Only teacher can upload");

  const { title, className, subject, description} = req.body;

  if (!title || !className || !subject) {
    throw new ApiError(400, "title, className, subject are required");
  }

  if (!req.file) {
    throw new ApiError(400, "File is required (pdf/image)");
  }

  // File info from multer
  const fileName = req.file.originalname;
  const fileUrl = `/uploads/study-material/${req.file.filename}`;

  const material = await StudyMaterial.create({
    uploader: req.user._id,
    title: title.trim(),
    className: className.trim(),
    subject: subject.trim(),
    description: description?.trim() || "",
   
  });

  return res
    .status(201)
    .json(new ApiResponse(201, material, "Study material uploaded"));
});

/**
 * TEACHER: Get my uploaded materials
 */
export const getMyStudyMaterialsTeacher = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "teacher")
    throw new ApiError(403, "Only teacher can access");

  const materials = await StudyMaterial.find({
    uploader: req.user._id,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, materials, "My materials fetched"));
});

/**
 * TEACHER: Delete material (soft delete)
 */
export const deleteStudyMaterialTeacher = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "teacher")
    throw new ApiError(403, "Only teacher can delete");

  const materialId = req.params.materialId;

  const material = await StudyMaterial.findById(materialId);
  if (!material) throw new ApiError(404, "Material not found");

  if (String(material.uploader) !== String(req.user._id)) {
    throw new ApiError(403, "You can delete only your materials");
  }

  material.isActive = false;
  await material.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Material deleted"));
});

/**
 * STUDENT: Get study materials
 * Filters: className, subject, search
 */
export const getStudyMaterialsStudent = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "student")
    throw new ApiError(403, "Only students can access");

  const { className, subject, search } = req.query;

  const query = { isActive: true };

  // If your student has className in profile, you can force it:
  // query.className = req.user.className

  if (className && className !== "All") query.className = className;
  if (subject && subject !== "All") query.subject = subject;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { className: { $regex: search, $options: "i" } },
    ];
  }

  const materials = await StudyMaterial.find(query)
    .populate("uploader", "fullName role")
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, materials, "Study materials fetched"));
});

/**
 * COMMON: Get single material details (teacher/student)
 */
export const getSingleStudyMaterial = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");

  const materialId = req.params.materialId;

  const material = await StudyMaterial.findById(materialId).populate(
    "uploader",
    "fullName role"
  );

  if (!material || !material.isActive) {
    throw new ApiError(404, "Material not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, material, "Material fetched"));
});