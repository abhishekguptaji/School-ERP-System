import StudentProfile from "../models/studentProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const getMyStudentProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id }).populate(
    "user",
    "name email rollNumber"
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
            rollNumber: req.user.rollNumber,
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
    ).populate("user", "name email rollNumber");
  } else {
    profile = await StudentProfile.create(payload);

    profile = await StudentProfile.findById(profile._id).populate(
      "user",
      "name email rollNumber",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile saved successfully"));
});

export { 
  getMyStudentProfile, 
  createOrUpdateStudentProfile
};
