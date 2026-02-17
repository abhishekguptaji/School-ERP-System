import mongoose from "mongoose";

const subjectPeriodPlanSchema = new mongoose.Schema(
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
    periodsPerWeek: { 
      type: Number, 
      required: true, 
      min: 1, max: 10
    },
  },
  { timestamps: true },
);

subjectPeriodPlanSchema.index({ classId: 1, subjectId: 1 }, { unique: true });

const SubjectPeriodPlan =  mongoose.model("SubjectPeriodPlan", subjectPeriodPlanSchema);

export default SubjectPeriodPlan;