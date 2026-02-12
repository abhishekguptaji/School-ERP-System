import StudentProfile from "../models/studentProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const getMyStudentProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id }).populate(
    "user",
    "name email campusId"
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
        "Profile not created yet, basic user data sent"
      )
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
      "Complete profile fetched"
    )
  );
});

const createOrUpdateStudentProfile = asyncHandler(async (req, res) => {
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

  const existingProfile = await StudentProfile.findOne({ user: req.user._id });

  let userImage = existingProfile?.userImage || "";
  let fatherImage = existingProfile?.fatherImage || "";
  let motherImage = existingProfile?.motherImage || "";

  if (req.files?.userImage?.[0]) {
    const upload = await uploadOnCloudinary(
      req.files.userImage[0].path,
      "schoolERP/student/user",
    );
    if (upload?.secure_url) userImage = upload.secure_url;
  }

  if (req.files?.fatherImage?.[0]) {
    const upload = await uploadOnCloudinary(
      req.files.fatherImage[0].path,
      "schoolERP/student/father",
    );
    if (upload?.secure_url) fatherImage = upload.secure_url;
  }

  if (req.files?.motherImage?.[0]) {
    const upload = await uploadOnCloudinary(
      req.files.motherImage[0].path,
      "schoolERP/student/mother",
    );
    if (upload?.secure_url) motherImage = upload.secure_url;
  }

  if (!existingProfile) {
    if (!userImage || !fatherImage || !motherImage) {
      throw new ApiError(
        400,
        "Student, Father, and Mother images are required",
      );
    }
  }

  const payload = {
    user: req.user._id,

    userImage,
    fatherImage,
    motherImage,

    admissionNumber: parsedData.admissionNumber,
    className: parsedData.className ? Number(parsedData.className) : null,
    dob: parsedData.dob,
    gender: parsedData.gender,
    bloodGroup: parsedData.bloodGroup,

    address: parsedData.address,
    father: parsedData.father,
    mother: parsedData.mother,
    guardian: parsedData.guardian,
    documents: parsedData.documents,
  };

  let profile;

  if (existingProfile) {
    profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      payload,
      { new: true, runValidators: true },
    ).populate("user", "name email campusId");
  } else {
    profile = await StudentProfile.create(payload);

    profile = await StudentProfile.findById(profile._id).populate(
      "user",
      "name email campusId",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile saved successfully"));
});


const getAllStudentProfilesByAdmin = asyncHandler(async (req, res) => {
  const adminId = req.user?._id;
  const role = req.user?.role;

  if (!adminId) throw new ApiError(401, "Unauthorized");
  if (role !== "admin") throw new ApiError(403, "Admin only access");

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // filters
  const search = (req.query.search || "").trim();
  const className = (req.query.className || "").trim();
  const gender = (req.query.gender || "").trim();

  const filter = {};

  // class filter (className is number in DB)
  if (className) {
    filter.className = Number(className);
  }

  // gender filter
  if (gender) {
    filter.gender = gender;
  }

  // 🔥 search by user fields (name/email/campusId)
  if (search) {
    const matchedUsers = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { campusId: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const userIds = matchedUsers.map((u) => u._id);

    // If no users matched, return empty quickly
    if (userIds.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            students: [],
            pagination: {
              total: 0,
              page,
              limit,
              totalPages: 0,
            },
          },
          "All student profiles fetched successfully"
        )
      );
    }

    filter.user = { $in: userIds };
  }

  const total = await StudentProfile.countDocuments(filter);

  const students = await StudentProfile.find(filter)
    .populate("user", "name email campusId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        students,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "All student profiles fetched successfully"
    )
  );
});



const getCompleteStudentProfileByAdmin = asyncHandler(async (req, res) => {
  const adminId = req.user?._id;
  const role = req.user?.role;

  if (!adminId) throw new ApiError(401, "Unauthorized");
  if (role !== "admin") throw new ApiError(403, "Admin only access");

  const { studentProfileId } = req.params;

  if (!studentProfileId) {
    throw new ApiError(400, "Student profile id is required");
  }

  const profile = await StudentProfile.findById(studentProfileId)
    .populate("user", "name email campusId");

  if (!profile) throw new ApiError(404, "Student profile not found");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: profile?.user || null,
        profile,
        isProfileCreated: true,
      },
      "Complete profile fetched"
    )
  );
});


export { 
  getMyStudentProfile, 
  createOrUpdateStudentProfile,
  getAllStudentProfilesByAdmin,
  getCompleteStudentProfileByAdmin,
};
