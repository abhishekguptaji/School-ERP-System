import mongoose from "mongoose";

const feeItemSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
      required: true, 
      trim: true 
    },
    amount: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    type: {
      type: String,
      enum: ["MONTHLY", "QUARTERLY", "YEARLY", "ONE_TIME"],
      required: true,
    },
  },
  { _id: false },
);

const feeStructureSchema = new mongoose.Schema(
  {
    className: { 
      type: Number, 
      required: true, 
      trim: true, 
      index: true },
    academicYear: { 
      type: String, 
      required: true, 
      trim: true, 
      index: true 
    },
    items: { 
      type: [feeItemSchema], 
      default: [] 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true },
);

feeStructureSchema.index({ className: 1, academicYear: 1 }, { unique: true });

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
export default FeeStructure;
