import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema(
  {
   uploader:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },
  }, 
  { timestamps: true }
);

const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);

export default StudyMaterial;
