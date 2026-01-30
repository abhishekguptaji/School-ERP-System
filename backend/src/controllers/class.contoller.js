import Class from "../models/Class.js";

const createClass = async (req, res) => {
  try {
    const { className, section, academicYear } = req.body;

    if (!className || !section || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "className, section and academicYear are required",
      });
    }

    const newClass = await Class.create({
      className,
      section,
      academicYear,
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    console.error("Create Class Error:", error);

    res.status(500).json({
      success: false,
      message:
        error.code === 11000
          ? "Class already exists for this academic year"
          : "Server error while creating class",
    });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const { page = 1, limit = 10, academicYear, isActive = true } = req.query;

    const query = {
      isActive: isActive === "true",
    };

    if (academicYear) query.academicYear = academicYear;

    const classes = await Class.find(query)
      .sort({ className: 1, section: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Class.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: classes,
    });
  } catch (error) {
    console.error("Get Classes Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getActiveClasses = async (req, res) => {
  try {
    const classes = await Class.find({ isActive: true }).sort({
      className: 1,
      section: 1,
    });

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error("Get Active Classes Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedClass = await Class.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error) {
    console.error("Update Class Error:", error);

    res.status(500).json({
      success: false,
      message:
        error.code === 11000 ? "Duplicate class detected" : "Server error",
    });
  }
};

const deactivateClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classData = await Class.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate Class Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export {
  createClass,
  getAllClasses,
  getActiveClasses,
  updateClass,
  deactivateClass,
};
