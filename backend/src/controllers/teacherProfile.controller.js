import TeacherProfile from "../models/teacherProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// export const getTeacherDashboard = asyncHandler(async (req, res) => {
//   const userId = req.user?._id;

//   if (!userId) throw new ApiError(401, "Unauthorized");

//   if (req.user.role !== "teacher") {
//     throw new ApiError(403, "Only teachers can access teacher dashboard");
//   }

//   const profile = await TeacherProfile.findOne({ user: userId })
//     .select("teacherImage designation department dateOfJoining isActive user")
//     .populate("user", "name email");

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         profile,
//         isProfileCreated: !!profile,
//       },
//       "Teacher dashboard fetched"
//     )
//   );
// });

// const createOrUpdateTeacherProfile = asyncHandler(async (req, res) => {
//   const userId = req.user?._id;

//   if (!userId) throw new ApiError(401, "Unauthorized");

//   if (req.user.role !== "teacher") {
//     throw new ApiError(403, "Only teachers can create/update teacher profile");
//   }

//   if (!req.body?.data) {
//     throw new ApiError(400, "Missing 'data' field in form-data");
//   }

//   let parsedData;
//   try {
//     parsedData = JSON.parse(req.body.data);
//   } catch (err) {
//     throw new ApiError(400, "Invalid JSON in 'data' field");
//   }

//   const teacherImage = req.file?.path || req.file?.secure_url || "";

//   const updateData = {
//     designation: parsedData.designation,
//     department: parsedData.department,
//     dateOfJoining: parsedData.dateOfJoining,
//     qualification: parsedData.qualification,
//     experience: parsedData.experience,
//     subjects: parsedData.subjects,
//     address: parsedData.address,
//     documents: parsedData.documents,
//     isActive: parsedData.isActive,
//   };

//   // If image uploaded
//   if (teacherImage) {
//     updateData.teacherImage = teacherImage;
//   }

//   // upsert (create if not exists)
//   const profile = await TeacherProfile.findOneAndUpdate(
//     { user: userId },
//     { $set: { user: userId, ...updateData } },
//     { new: true, upsert: true }
//   ).populate("user", "name email");

//   return res
//     .status(200)
//     .json(new ApiResponse(200, profile, "Teacher profile saved"));
// });

const getTeacherProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  if (req.user.role !== "teacher") {
    throw new ApiError(403, "Only teachers can access teacher profile");
  }
  const profile = await TeacherProfile.findOne({ user: userId }).populate(
    "user",
    "name email employeeId",
  );

  if (!profile) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            _id: userId,
            name: req.user.name,
            email: req.user.email,
            employeeId: req.user.employeeId,
          },
          profile: null,
          isProfileCreated: false,
        },
        "Profile not created of Teacher, Basic Details are share",
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
      "Complete Profile Fetched of Teacher",
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
    ).populate("user", "name email employeeId");
  } else {
    profile = await TeacherProfile.create(payload);

    profile = await TeacherProfile.findById(profile._id).populate(
      "user",
      "name email employeeId",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Teacher Profile Saved Successfully"));
});

export { getTeacherProfile, createOrUpdateTeacherProfile };
