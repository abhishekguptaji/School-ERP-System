import mongoose from "mongoose";
import Counter from "./counter.model.js";

const libraryBookCopySchema = new mongoose.Schema(
  {
    copyId: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LibraryBook",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Available", "Issued", "Lost"],
      default: "Available",
      index: true,
    },

    issuedToStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    issuedAt: { type: Date, default: null },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// Auto-generate Copy ID: LIB-2026-00001
libraryBookCopySchema.pre("validate", async function () {
  try {
    if (!this.copyId) {
      const counter = await Counter.findOneAndUpdate(
        { name: "copyId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const year = new Date().getFullYear();
      this.copyId = `LIB-${year}-${String(counter.seq).padStart(5, "0")}`;
    }
  } catch (error) {
    console.log(error);
  }
});

// Data consistency rules
libraryBookCopySchema.pre("save", function () {
  if (this.status === "Available") {
    this.issuedToStudent = null;
    this.issuedAt = null;
    this.dueDate = null;
  }

  if (this.status === "Lost") {
    this.issuedToStudent = null;
    this.issuedAt = null;
    this.dueDate = null;
  }

});

const LibraryBookCopy = mongoose.model("LibraryBookCopy", libraryBookCopySchema);
export default LibraryBookCopy;