import LibraryBook from "../models/libraryBook.model.js";
import LibraryBookCopy from "../models/libraryBookCopy.model.js";
import LibraryReturn from "../models/libraryReturn.model.js";
import StudentProfile from "../models/studentProfile.model.js";
import User from "../models/user.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addBookByAdmin = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized User");

  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Only admin can add books");
  }

  const { title, author, category, description, copies } = req.body;

  if (!title || !author || !category || !copies) {
    throw new ApiError(400, "All required fields missing");
  }

  const c = Number(copies);
  if (!c || c <= 0) throw new ApiError(400, "copies must be > 0");

  const alreadyExists = await LibraryBook.findOne({
    title: new RegExp(`^${title.trim()}$`, "i"),
    author: new RegExp(`^${author.trim()}$`, "i"),
  });

  if (alreadyExists) throw new ApiError(409, "This book is already listed");

  const newBook = await LibraryBook.create({
    title: title.trim(),
    author: author.trim(),
    category: category.trim(),
    totalCopies: c,
    availableCopies: c,
    description: description?.trim() || "",
  });

  for (let i = 0; i < c; i++) {
    await LibraryBookCopy.create({
      book: newBook._id,
      status: "Available",
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newBook, `Book added + ${c} copies created`));
});

const getAllBooksAdmin = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "admin") throw new ApiError(403, "Only admin can access");

  const books = await LibraryBook.find().sort({ createdAt: -1 });

  const results = books.map((b) => ({
    ...b.toObject(),
    issuedCopies: Math.max(0, b.totalCopies - b.availableCopies),
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Books fetched successfully"));
});

const getCopiesOfBookAdmin = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "admin") throw new ApiError(403, "Only admin can view");

  const bookId = req.params.bookId;

  const book = await LibraryBook.findById(bookId);
  if (!book) throw new ApiError(404, "Book not found");

  const copies = await LibraryBookCopy.find({ book: book._id })
    .populate("issuedToStudent", "campusId email name")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { book, copies }, "Copies fetched"));
});

const addMoreCopiesAdmin = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "admin") throw new ApiError(403, "Only admin can add");

  const { count } = req.body;
  const bookId = req.params.bookId;

  const book = await LibraryBook.findById(bookId);
  if (!book) throw new ApiError(404, "Book not found");

  const c = Number(count);
  if (!c || c <= 0) throw new ApiError(400, "Count must be > 0");

  for (let i = 0; i < c; i++) {
    await LibraryBookCopy.create({
      book: book._id,
      status: "Available",
    });
  }

  // IMPORTANT: update both counts
  book.totalCopies += c;
  book.availableCopies += c;
  await book.save();

  return res
    .status(201)
    .json(new ApiResponse(201, book, `${c} new copies added`));
});


const issueCopyToStudentAdmin = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "admin") throw new ApiError(403, "Only admin can issue");

  const { campusId, dueDate } = req.body;
  const copyId = req.params.copyId;

  if (!campusId) throw new ApiError(400, "campusId is required");

  const copy = await LibraryBookCopy.findById(copyId).populate("book");
  if (!copy) throw new ApiError(404, "Copy not found");

  if (copy.status === "Issued") throw new ApiError(400, "This copy is already issued");
  if (copy.status === "Lost") throw new ApiError(400, "This copy is marked as Lost");

  const studentUser = await User.findOne({
    campusId: campusId.trim().toUpperCase(),
    role: "student",
  });

  if (!studentUser) throw new ApiError(404, "Student not found with this campusId");

  // dueDate default = 7 days
  const finalDueDate = dueDate
    ? new Date(dueDate)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // update copy
  copy.status = "Issued";
  copy.issuedToStudent = studentUser._id; // ✅ USER ID
  copy.issuedAt = new Date();
  copy.dueDate = finalDueDate;
  await copy.save();

  // update book counts
  const book = await LibraryBook.findById(copy.book._id);
  if (book) {
    book.availableCopies = Math.max(0, book.availableCopies - 1);
    await book.save();
  }

  // create issue record
  await LibraryReturn.create({
    book: copy.book._id,
    copy: copy._id,
    student: studentUser._id,
    dueDate: finalDueDate,
  });

  return res.status(200).json(new ApiResponse(200, copy, "Copy issued successfully"));
});


const deleteBookAdmin = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "admin") throw new ApiError(403, "Only admin can delete");

  const bookId = req.params.bookId;

  const book = await LibraryBook.findById(bookId);
  if (!book) throw new ApiError(404, "Book not found");

  const issuedExists = await LibraryBookCopy.findOne({
    book: book._id,
    status: "Issued",
  });

  if (issuedExists) {
    throw new ApiError(400, "Cannot delete book, some copies are issued");
  }

  const pendingReturn = await LibraryReturn.findOne({
    book: book._id,
    status: "Pending",
  });

  if (pendingReturn) {
    throw new ApiError(400, "Cannot delete book, return requests are pending");
  }

  await LibraryBookCopy.deleteMany({ book: book._id });
  await LibraryReturn.deleteMany({ book: book._id }); 

  await LibraryBook.findByIdAndDelete(book._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Book and all copies deleted"));
});

const getReturnRequestsAdmin = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "admin") throw new ApiError(403, "Only admin");

  const requests = await LibraryReturn.find({ status: "Pending" })
    .populate({
      path: "copy",
      populate: { path: "book" },
    })
    .populate("student", "name email campusId")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Return requests fetched"));
});

const acceptReturnAdmin = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "admin") throw new ApiError(403, "Only admin");

  const requestId = req.params.requestId;

  const request = await LibraryReturn.findById(requestId)
    .populate({
      path: "copy",
      populate: { path: "book" },
    })
    .populate("student");

  if (!request) throw new ApiError(404, "Return request not found");

  if (request.status !== "Pending") {
    throw new ApiError(400, "Request already processed");
  }

  const copy = await LibraryBookCopy.findById(request.copy._id);
  if (!copy) throw new ApiError(404, "Copy not found");

  const book = await LibraryBook.findById(request.book || request.copy.book._id);
  if (!book) throw new ApiError(404, "Book not found");

  copy.status = "Available";
  copy.issuedToStudent = null;
  copy.issuedAt = null;
  copy.dueDate = null;
  await copy.save();

  await LibraryReturn.findOneAndUpdate(
    { copy: copy._id, status: "Issued" },
    { status: "Returned", returnedAt: new Date() }
  );

  request.status = "Accepted";
  request.acceptedAt = new Date();
  await request.save();

  book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
  await book.save();

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Return accepted successfully"));
});

const rejectReturnAdmin = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "admin") throw new ApiError(403, "Only admin");

  const requestId = req.params.requestId;

  const request = await LibraryReturn.findById(requestId);
  if (!request) throw new ApiError(404, "Return request not found");

  if (request.status !== "Pending") {
    throw new ApiError(400, "Request already processed");
  }

  request.status = "Rejected";
  request.rejectedAt = new Date();
  await request.save();

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Return rejected"));
});

const getMyIssuedCopiesStudent = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "student") throw new ApiError(403, "Only students");

  const copies = await LibraryBookCopy.find({
    issuedToStudent: req.user._id,
    status: "Issued",
  })
    .populate("issuedToStudent", "campusId name")
    .populate("book","title author")
    .sort({ issuedAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, copies, "My issued books fetched"));
});


const requestReturnStudent = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized User");
  if (req.user?.role !== "student") throw new ApiError(403, "Only students");

  const studentId = req.user._id;
  const copyId = req.params.copyId;

  const copy = await LibraryBookCopy.findById(copyId);
  if (!copy) throw new ApiError(404, "Copy not found");

  if (copy.status !== "Issued") throw new ApiError(400, "Copy is not issued");

  if (String(copy.issuedToStudent) !== String(studentId)) {
    throw new ApiError(403, "This copy is not issued to you");
  }

  // check pending
  const alreadyPending = await LibraryReturn.findOne({
    copy: copy._id,
    student: studentId,
    status: "Pending",
  });

  if (alreadyPending) {
    throw new ApiError(400, "Return request already pending");
  }

  // create request
  const request = await LibraryReturn.create({
    book: copy.book,
    copy: copy._id,
    student: studentId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, request, "Return request sent"));
});

export { 
  addBookByAdmin,
  getAllBooksAdmin,
  addMoreCopiesAdmin,
  issueCopyToStudentAdmin,
  deleteBookAdmin,
  getMyIssuedCopiesStudent,
  requestReturnStudent,
  getReturnRequestsAdmin,
  rejectReturnAdmin,
  acceptReturnAdmin,
  getCopiesOfBookAdmin
};
