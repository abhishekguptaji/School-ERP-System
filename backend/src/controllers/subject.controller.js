import mongoose from "mongoose";
import Subject from "../models/Subject.js";
import Class from "../models/Class.js";

const createSubject = async (req, res) => {
  try {
    const { name, class: classId, code } = req.body;

    if (!name || !classId) {
      return res.status(400).json({
        success: false,
        message: "Subject name and class are required",
      });
    }

    // validate class
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const subject = await Subject.create({
      name,
      class: classId,
      code,
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Create Subject Error:", error);

    res.status(500).json({
      success: false,
      message:
        error.code === 11000
          ? "Subject already exists for this class"
          : "Server error while creating subject",
    });
  }
};

const getAllSubjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      classId,
      search,
      isActive = true,
    } = req.query;

    const query = {
      isActive: isActive === "true",
    };

    if (classId) query.class = new mongoose.Types.ObjectId(classId);

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const subjects = await Subject.find(query)
      .populate("class")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Subject.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: subjects,
    });
  } catch (error) {
    console.error("Get Subjects Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "Class ID is required",
      });
    }

    const subjects = await Subject.find({
      class: classId,
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error("Get Subjects By Class Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("class");

    if (!updatedSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: updatedSubject,
    });
  } catch (error) {
    console.error("Update Subject Error:", error);

    res.status(500).json({
      success: false,
      message:
        error.code === 11000
          ? "Duplicate subject for this class"
          : "Server error",
    });
  }
};

const deactivateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate Subject Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export {
  createSubject,
  getAllSubjects,
  getSubjectsByClass,
  updateSubject,
  deactivateSubject,
};
