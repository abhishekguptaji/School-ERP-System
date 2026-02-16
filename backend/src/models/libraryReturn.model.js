import mongoose from "mongoose";

const libraryReturnSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LibraryBook",
      required: true,
      index: true,
    },

    copy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LibraryBookCopy",
      required: true,
      index: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
      index: true,
    },

    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },

    adminRemark: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);


libraryReturnSchema.index(
  { copy: 1, student: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "Pending" } }
);

const LibraryReturn = mongoose.model("LibraryReturn", libraryReturnSchema);
export default LibraryReturn;