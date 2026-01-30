import Result from "../models/Result.js";

/* ===============================
   COMPILE RESULT (TEACHER / ADMIN)
================================ */
export const compileResult = async (req, res) => {
  try {
    const { studentId, examId, subjects } = req.body;

    let totalObtained = 0;
    let totalMax = 0;

    subjects.forEach((s) => {
      totalObtained += s.marksObtained;
      totalMax += s.maxMarks;
    });

    const percentage = ((totalObtained / totalMax) * 100).toFixed(2);

    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 75) grade = "A";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 45) grade = "C";

    const result = await Result.create({
      student: studentId,
      exam: examId,
      subjects,
      totalObtained,
      percentage,
      grade,
    });

    res.status(201).json({
      success: true,
      message: "Result compiled successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Result compilation failed" });
  }
};

/* ===============================
   STUDENT VIEW OWN RESULT
================================ */
export const getMyResult = async (req, res) => {
  try {
    const studentId = req.user.profileId;

    const results = await Result.find({ student: studentId })
      .populate("exam")
      .populate("subjects.subject", "name");

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch results" });
  }
};
