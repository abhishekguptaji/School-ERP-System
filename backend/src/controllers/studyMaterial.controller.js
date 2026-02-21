import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import StudyMaterial from "../models/studyMaterial.model.js";
import TeacherProfile from "../models/teacherProfile.model.js";
import StudentProfile from "../models/studentProfile.model.js";
import Class from "../models/class.model.js";
import TimeTable from "../models/timeTable.model.js";


export const getMyAllocations = asyncHandler(async (req, res) => {
  const teacher = await TeacherProfile.findOne({ user: req.user._id });

  if (!teacher) {
    throw new ApiError(404, "Teacher profile not found");
  }

  const allocations = await TimeTable.find({
    teacherId: teacher._id,
  })
    .populate("classId", "className")
    .populate("subjectId", "name");

  const uniqueAllocations = [];
  const map = new Set();

  allocations.forEach((item) => {
    const key = `${item.classId._id}-${item.subjectId._id}`;
    if (!map.has(key)) {
      map.add(key);
      uniqueAllocations.push({
        classId: item.classId,
        subjectId: item.subjectId,
      });
    }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, uniqueAllocations, "Allocations fetched successfully"));
});

export const uploadStudyMaterial = asyncHandler(async (req, res) => {
  const { title, classId, subjectId, description } = req.body;

  if (!title || !classId || !subjectId) {
    throw new ApiError(400, "Title, Class and Subject are required");
  }

  const teacher = await TeacherProfile.findOne({ user: req.user._id });

  if (!teacher) {
    throw new ApiError(404, "Teacher profile not found");
  }

  const isAllocated = await TimeTable.findOne({
    teacherId: teacher._id,
    classId,
    subjectId,
  });

  if (!isAllocated) {
    throw new ApiError(
      403,
      "You are not assigned to this subject for this class"
    );
  }

  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  const uploadResult = await uploadOnCloudinary(req.file.path);

  if (!uploadResult) {
    throw new ApiError(500, "File upload failed");
  }

  const fileExtension = req.file.mimetype.split("/")[1];

  const material = await StudyMaterial.create({
    uploader: req.user._id,
    title,
    classId,
    subjectId,
    description,
    fileType: fileExtension,
    fileName: req.file.originalname,
    fileUrl: uploadResult.secure_url,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, material, "Study material uploaded successfully"));
});

export const getMyStudyMaterials = asyncHandler(async (req, res) => {
  const { classId, subjectId, search, page = 1, limit = 10 } = req.query;

  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  const query = {
    uploader: req.user._id,
    isActive: true,
  };

  if (classId) {
    query.classId = classId;
  }

  if (subjectId) {
    query.subjectId = subjectId;
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const materials = await StudyMaterial.find(query)
    .populate("classId", "className")
    .populate("subjectId", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await StudyMaterial.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        count: materials.length,
        materials,
      },
      "Study materials fetched successfully"
    )
  );
});

export const deleteStudyMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const material = await StudyMaterial.findById(id);

  if (!material) {
    throw new ApiError(404, "Study material not found");
  }

  if (material.uploader.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own materials");
  }

  material.isActive = false;
  await material.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Study material deleted successfully"));
});

export const studentgetStudyMaterial = asyncHandler(async (req, res) => {

  const student = await StudentProfile.findOne({ user: req.user._id });

  if (!student) {
    throw new ApiError(404, "Student profile not found");
  }
  
  const stId = await Class.findOne({className : student.className}).select("_id");
  // console.log(stId);
  // console.log(student)
  const materials = await StudyMaterial.find({
    classId: stId
  })
  .populate("subjectId", "name")
  .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Study materials fetched successfully",
    data: materials
  });

});