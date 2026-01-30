import Notice from "../models/Notice.js";

/* ===============================
   CREATE NOTICE (ADMIN)
================================ */
export const createNotice = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      audience,
      visibleFrom,
      visibleTill,
    } = req.body;

    if (!title || !category || !audience) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const attachments = req.files?.map((file) => ({
      fileName: file.originalname,
      fileUrl: `/uploads/notices/${file.filename}`,
      fileType: file.mimetype,
    }));

    const notice = await Notice.create({
      title,
      description,
      category,
      audience,
      visibleFrom,
      visibleTill,
      attachments,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Notice published successfully",
      data: notice,
    });
  } catch (error) {
    console.error("Create Notice Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create notice",
    });
  }
};

/* ===============================
   GET NOTICES (STUDENT / TEACHER)
================================ */
export const getMyNotices = async (req, res) => {
  try {
    const role = req.user.role;
    const now = new Date();

    const notices = await Notice.find({
      isActive: true,
      visibleFrom: { $lte: now },
      $or: [
        { visibleTill: { $gte: now } },
        { visibleTill: { $exists: false } },
      ],
      audience:
        role === "student"
          ? { $in: ["Student", "Both"] }
          : { $in: ["Teacher", "Both"] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (error) {
    console.error("Get Notices Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
    });
  }
};

/* ===============================
   ADMIN: ALL NOTICES
================================ */
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notices" });
  }
};

/* ===============================
   DEACTIVATE NOTICE
================================ */
export const deactivateNotice = async (req, res) => {
  try {
    await Notice.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    res.status(200).json({
      success: true,
      message: "Notice removed",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to deactivate notice" });
  }
};
