import Attendance from "../models/attendence.model.js";
import StudentProfile from "../models/studentProfile.model.js";

const markAttendance = async (req, res) => {
  try {
    const { classId, subjectId, date, students } = req.body;

    if (!classId || !subjectId || !date || !students?.length) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const exists = await Attendance.findOne({
      class: classId,
      subject: subjectId,
      date: new Date(date),
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Attendance already marked for this date",
      });
    }

    const attendance = await Attendance.create({
      class: classId,
      subject: subjectId,
      teacher: req.user.profileId,
      date,
      students,
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.profileId;

    const attendance = await Attendance.find({
      "students.student": studentId,
    })
      .populate("subject", "name")
      .populate("class")
      .sort({ date: -1 });

    const formatted = attendance.map((a) => {
      const record = a.students.find((s) => s.student.toString() === studentId);
      return {
        date: a.date,
        subject: a.subject,
        status: record.status,
      };
    });

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get Student Attendance Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getClassAttendance = async (req, res) => {
  try {
    const { classId, subjectId, from, to } = req.query;

    const query = {};
    if (classId) query.class = classId;
    if (subjectId) query.subject = subjectId;
    if (from && to) query.date = { $gte: new Date(from), $lte: new Date(to) };

    const attendance = await Attendance.find(query)
      .populate("class")
      .populate("subject")
      .populate("teacher", "user")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Get Class Attendance Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const finalizeAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { isFinalized: true },
      { new: true },
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance finalized",
    });
  } catch (error) {
    console.error("Finalize Attendance Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export {
  markAttendance,
  getMyAttendance,
  getClassAttendance,
  finalizeAttendance,
};
