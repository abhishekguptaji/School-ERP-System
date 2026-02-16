import mongoose from "mongoose";
import Counter from "./counter.model.js";

const libraryBookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    totalCopies: {
      type: Number,
      required: true,
      min: 1,
    },

    availableCopies: {
      type: Number,
      min: 0,
      default: function () {
        return this.totalCopies;
      },
    },
  },
  { timestamps: true }
);

// Auto-generate Book ID: BOOK-0001
libraryBookSchema.pre("validate", async function () {
  try {
    if (!this.bookId) {
      const counter = await Counter.findOneAndUpdate(
        { name: "bookId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const padded = String(counter.seq).padStart(4, "0");
      this.bookId = `BOOK-${padded}`;
    }
  } catch (err) {
    console.log(err);
  }
});

// Prevent duplicate same title + author (case insensitive)
libraryBookSchema.index(
  { title: 1, author: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const LibraryBook = mongoose.model("LibraryBook", libraryBookSchema);
export default LibraryBook;