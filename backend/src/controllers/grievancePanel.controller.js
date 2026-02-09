import GrievancePanel from "../models/grievancePanel.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createGrievance = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized User are Come");
  }
  if (req.user.role !== "student" && req.user.role !== "teacher") {
    throw new ApiError(403, "Only Student and Teacher are complain to admin");
  }

  const { title, description, category, priority } = req.body;
  if (!title || !description || !category) {
    throw new ApiError(400, "title, description and category are required");
  }

  let attachment = null;

  if (req.files?.attachment?.[0]) {
    const file = req.files.attachment[0];

    const uploaded = await uploadOnCloudinary(
      file.path,
      "schoolERP/student/grievance",
    );

    if (uploaded?.secure_url) {
      attachment = {
        fileUrl: uploaded.secure_url,
        fileType: file.mimetype.includes("pdf") ? "pdf" : "image",
        publicId: uploaded.public_id || "",
      };
    }
  }

  const grievance = await GrievancePanel.create({
    title,
    description,
    category,
    priority: priority || "medium",
    createdBy: userId,
    createdByRole: req.user.role,
    attachment,
  });

  if (!grievance) {
    throw new ApiError(500, "Grivance is not created Yet");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        grievance,
        "Grievance Created Successfully. Wait for Resposne..",
      ),
    );
});

export { createGrievance };
