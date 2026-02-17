import mongoose from "mongoose";

const subjectTeacherSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },
  },
  { timestamps: true }
);


subjectTeacherSchema.index(
  { classId: 1, subjectId: 1 },
  { unique: true }
);

export default mongoose.model("SubjectTeacher", subjectTeacherSchema);