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

const getOurGrievanceByStudent = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized User Want to see credentials");
  }

  if (req.user.role !== "student") {
    throw new ApiError(
      403,
      "Only student or teacher can view their grievances",
    );
  }

  const grievances = await GrievancePanel.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .populate("assignedTo", "name email role");

  return res
    .status(200)
    .json(
      new ApiResponse(200, grievances, "Your grievances fetched successfully"),
    );
});

const getAllGrievanceByAdmin = asyncHandler(async(req,res)=>{
   const userId = req.user._id;
   const role = req.user?.role;
   if(!userId){
    throw new ApiError(403,"Unauthorized Error");
   }

  if (role !== "admin") {
   throw new ApiError(403, "Access denied. Admin only.");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = req.query.search || "";
  const status = req.query.status || "";      
  const priority = req.query.priority || "";   
  const sortBy = req.query.sortBy || "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;

  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  if (search) {
    filter.$or = [
      { ticketId: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }

  const total = await GrievancePanel.countDocuments(filter);

  const grievances = await GrievancePanel.find(filter)
    .populate("createdBy", "name email role studentId teacherId")
    .populate("assignedTo", "name email role")
    .populate("replies.sender", "name email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(200, {
      grievances,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, "All grievances fetched successfully")
  );
});

const replyToGrievanceByAdmin = asyncHandler(async (req, res) => {
  const adminId = req.user?._id;
  const role = req.user?.role;

  if (!adminId) throw new ApiError(401, "Unauthorized");
  if (role !== "admin") throw new ApiError(403, "Admin only access");

  const { grievanceId } = req.params;
  const { message } = req.body;

  if (!grievanceId) throw new ApiError(400, "Grievance ID is required");
  if (!message || message.trim().length < 2) {
    throw new ApiError(400, "Reply message must be at least 2 characters");
  }

  const grievance = await GrievancePanel.findById(grievanceId);
  if (!grievance) throw new ApiError(404, "Grievance not found");

  // optional: closed/resolved pe reply allow karna ya nahi
  if (["closed"].includes(grievance.status)) {
    throw new ApiError(400, "This grievance is closed. Cannot reply.");
  }

  grievance.replies.push({
    sender: adminId,
    senderRole: "admin",
    message: message.trim(),
  });

  if (grievance.status === "pending") {
    grievance.status = "in_progress";
  }

  await grievance.save();

  const updated = await GrievancePanel.findById(grievanceId)
    .populate("createdBy", "fullName email role")
    .populate("assignedTo", "fullName email role")
    .populate("replies.sender", "fullName email role");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Reply added successfully"));
});

const updateGrievanceStatus = asyncHandler(async (req, res) => {
  const adminId = req.user?._id;
  const role = req.user?.role;

  if (!adminId) throw new ApiError(401, "Unauthorized");
  if (role !== "admin") throw new ApiError(403, "Admin only access");

  const { grievanceId } = req.params;
  const { status, remarks } = req.body;

  if (!grievanceId) throw new ApiError(400, "Grievance ID is required");

  const allowedStatus = [
    "pending",
    "in_progress",
    "resolved",
    "rejected",
    "closed",
  ];

  if (!status || !allowedStatus.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Allowed: ${allowedStatus.join(", ")}`
    );
  }

  const grievance = await GrievancePanel.findById(grievanceId);
  if (!grievance) throw new ApiError(404, "Grievance not found");

  // Update status
  grievance.status = status;

  // Update remarks (optional)
  if (typeof remarks === "string") {
    grievance.remarks = remarks.trim();
  }

  // Auto set resolvedAt
  if (status === "resolved" || status === "closed") {
    grievance.resolvedAt = new Date();
  } else {
    grievance.resolvedAt = null;
  }

  await grievance.save();

  const updated = await GrievancePanel.findById(grievanceId)
    .populate("createdBy", "fullName email role")
    .populate("assignedTo", "fullName email role")
    .populate("replies.sender", "fullName email role");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Grievance status updated"));
});


export { 
  createGrievance, 
  getOurGrievanceByStudent,
  getAllGrievanceByAdmin,
  updateGrievanceStatus,
  replyToGrievanceByAdmin
};
