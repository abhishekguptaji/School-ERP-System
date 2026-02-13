import TeacherProfile from "../models/teacherProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getTeacherProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== "teacher") {
    throw new ApiError(403, "Only teachers can access teacher profile");
  }

  const profile = await TeacherProfile.findOne({ user: req.user._id }).populate(
    "user",
    "name email campusId role",
  );

  if (!profile) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            campusId: req.user.campusId,
          },
          profile: null,
          isProfileCreated: false,
        },
        "Profile not created yet, basic user data sent",
      ),
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: profile.user,
        profile,
        isProfileCreated: true,
      },
      profile ? "Complete Profile Fetched of Teacher" : "Profile not created",
    ),
  );
});

const createOrUpdateTeacherProfile = asyncHandler(async (req, res) => {
  if (!req.body?.data) {
    throw new ApiError(400, "Missing 'data' field in form-data");
  }

  let parsedData;
  try {
    parsedData = JSON.parse(req.body.data);
  } catch (error) {
    console.log("DATA RECEIVED:", req.body.data);
    throw new ApiError(400, "Invalid JSON in 'data' field");
  }
  const existingProfile = await TeacherProfile.findOne({ user: req.user._id });

  let teacherImage = existingProfile?.teacherImage || "";

  if (req.files.teacherImage?.[0]) {
    const upload = await uploadOnCloudinary(
      req.files.teacherImage[0].path,
      "schoolERP/teacher/user",
    );
    if (upload?.secure_url) teacherImage = upload.secure_url;
  }

  if (!existingProfile) {
    if (!teacherImage) {
      throw new ApiError(400, "Teacher images are required");
    }
  }

  const payload = {
    user: req.user._id,
    teacherImage,

    status: parsedData.status,
    isActive: parsedData.isActive,

    designation: parsedData.designation,
    department: parsedData.department,
    dateOfJoining: parsedData.dateOfJoining,
    employmentType: parsedData.employmentType,
    qualification: parsedData.qualification,
    experienceYears: parsedData.experienceYears,

    isClassTeacher: parsedData.isClassTeacher,
    classTeacherOf: parsedData.classTeacherOf,

    dob: parsedData.dob,
    gender: parsedData.gender,
    bloodGroup: parsedData.bloodGroup,
    maritalStatus: parsedData.maritalStatus,
    category: parsedData.category,

    phone: parsedData.phone,
    alternatePhone: parsedData.alternatePhone,

    address: parsedData.address,

    emergencyContact: parsedData.emergencyContact,

    documents: parsedData.documents,

    bankDetails: parsedData.bankDetails,
  };

  let profile;

  if (existingProfile) {
    profile = await TeacherProfile.findOneAndUpdate(
      {
        user: req.user._id,
      },
      payload,
      {
        new: true,
        runValidators: true,
      },
    ).populate("user", "name email campusId");
  } else {
    profile = await TeacherProfile.create(payload);

    profile = await TeacherProfile.findById(profile._id).populate(
      "user",
      "name email campusId",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Teacher Profile Saved Successfully"));
});

export { getTeacherProfile, createOrUpdateTeacherProfile };
