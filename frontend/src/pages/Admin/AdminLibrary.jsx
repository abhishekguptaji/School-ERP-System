import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  adminAddBook,
  adminGetAllBooks,
  adminGetBookCopies,
  adminAddMoreCopies,
  adminIssueCopy,
  adminDeleteBook,
  adminGetReturnRequests,
  adminAcceptReturn,
  adminRejectReturn,
} from "../../services/adminService.js";

import "./css/AdminLibrary.css";

const AdminLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const [selectedBook, setSelectedBook] = useState(null);
  const [copies, setCopies] = useState([]);
  const [showCopiesPanel, setShowCopiesPanel] = useState(false);

  const [returnRequests, setReturnRequests] = useState([]);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    copies: 1,
  });

  const [addCopiesCount, setAddCopiesCount] = useState(1);

  // ================= FETCH =================

  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      const res = await adminGetAllBooks(); // res = {success, message, data}
      setBooks(res.data || []);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchReturnRequests = async () => {
    try {
      const res = await adminGetReturnRequests();
      setReturnRequests(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchReturnRequests();
  }, []);

  // ================= ADD BOOK =================

  const addBookHandler = async () => {
    try {
      const payload = {
        title: newBook.title,
        author: newBook.author,
        category: newBook.category,
        description: newBook.description,
        copies: Number(newBook.copies),
      };

      const res = await adminAddBook(payload);
      Swal.fire("Success", res.message, "success");

      setNewBook({
        title: "",
        author: "",
        category: "",
        description: "",
        copies: 1,
      });

      fetchBooks();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  // ================= COPIES =================

  const openCopies = async (book) => {
    try {
      setSelectedBook(book);
      const res = await adminGetBookCopies(book._id);
      setCopies(res.data?.copies || []);
      setShowCopiesPanel(true);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  const addMoreCopiesHandler = async () => {
    try {
      const c = Number(addCopiesCount);
      if (!c || c <= 0) return Swal.fire("Error", "Enter valid count", "error");

      const res = await adminAddMoreCopies(selectedBook._id, { count: c });
      Swal.fire("Success", res.message, "success");

      // refresh copies
      const res2 = await adminGetBookCopies(selectedBook._id);
      setCopies(res2.data?.copies || []);

      fetchBooks();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  // ================= ISSUE =================

const issueCopyHandler = async (copyMongoId) => {
  const { value: campusId } = await Swal.fire({
    title: "Enter Student Campus ID",
    input: "text",
    inputPlaceholder: "SVM-0021",
    showCancelButton: true,
  });

  if (!campusId) return;

  const { value: dueDate } = await Swal.fire({
    title: "Enter Due Date (Optional)",
    input: "text",
    inputPlaceholder: "YYYY-MM-DD",
    showCancelButton: true,
  });

  try {
    const res = await adminIssueCopy(copyMongoId, { campusId, dueDate });
    Swal.fire("Issued", res.message, "success");

    // refresh copies
    const res2 = await adminGetBookCopies(selectedBook._id);
    setCopies(res2.data?.copies || []);

    fetchBooks();
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || err.message, "error");
  }
};

  // ================= DELETE =================

  const deleteBookHandler = async (bookId) => {
    const confirm = await Swal.fire({
      title: "Delete this book?",
      text: "This will delete all copies too (only if none issued)",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await adminDeleteBook(bookId);
      Swal.fire("Deleted", res.message, "success");
      fetchBooks();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  // ================= RETURN REQUESTS =================

  const acceptReturnHandler = async (requestId) => {
    try {
      const res = await adminAcceptReturn(requestId);
      Swal.fire("Accepted", res.message, "success");

      fetchReturnRequests();

      // refresh copies panel if open
      if (selectedBook?._id) {
        const res2 = await adminGetBookCopies(selectedBook._id);
        setCopies(res2.data?.copies || []);
      }

      fetchBooks();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  const rejectReturnHandler = async (requestId) => {
    try {
      const res = await adminRejectReturn(requestId);
      Swal.fire("Rejected", res.message, "success");
      fetchReturnRequests();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  // ================= UI =================

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <h3 className="fw-bold text-primary mb-0"> Admin Library</h3>

        <button
          className="btn btn-outline-dark btn-sm"
          onClick={() => {
            fetchBooks();
            fetchReturnRequests();
          }}
        >
          Refresh
        </button>
      </div>

      {/* ADD BOOK */}
      <div className="card p-3 mt-3 adminLibCard">
        <h5 className="fw-bold mb-3">Add Book (Title Level)</h5>

        <div className="row g-2">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
            />
          </div>

          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Category"
              value={newBook.category}
              onChange={(e) =>
                setNewBook({ ...newBook, category: e.target.value })
              }
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Copies"
              min={1}
              value={newBook.copies}
              onChange={(e) =>
                setNewBook({ ...newBook, copies: e.target.value })
              }
            />
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={addBookHandler}>
              Add Book
            </button>
          </div>

          <div className="col-12">
            <textarea
              className="form-control"
              placeholder="Description"
              value={newBook.description}
              onChange={(e) =>
                setNewBook({ ...newBook, description: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* BOOK LIST */}
      <div className="card p-3 mt-3 adminLibCard">
        <h5 className="fw-bold mb-3">All Books</h5>

        {loadingBooks ? (
          <div className="text-muted">Loading...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>BookId</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Total</th>
                  <th>Available</th>
                  <th>Issued</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {books.map((b) => (
                  <tr key={b._id}>
                    <td className="fw-semibold">{b.bookId}</td>
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.category}</td>
                    <td>{b.totalCopies}</td>
                    <td>{b.availableCopies}</td>
                    <td>{b.issuedCopies}</td>

                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openCopies(b)}
                      >
                        Manage
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteBookHandler(b._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {books.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* COPIES PANEL */}
      {showCopiesPanel && (
        <div className="card p-3 mt-3 adminLibCard border border-primary">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0">
              Copies of: {selectedBook?.title}
            </h5>

            <button
              className="btn btn-sm btn-danger"
              onClick={() => setShowCopiesPanel(false)}
            >
              Close
            </button>
          </div>

          {/* ADD MORE COPIES */}
          <div className="d-flex gap-2 mt-3">
            <input
              type="number"
              className="form-control"
              min={1}
              value={addCopiesCount}
              onChange={(e) => setAddCopiesCount(e.target.value)}
            />

            <button className="btn btn-success" onClick={addMoreCopiesHandler}>
              Add Copies
            </button>
          </div>

          {/* COPIES TABLE */}
          <div className="table-responsive mt-3">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>CopyId</th>
                  <th>Status</th>
                  <th>Issued To</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {copies.map((c) => (
                  <tr key={c._id}>
                    <td className="fw-semibold">{c.copyId}</td>
                    <td>
                      <span
                        className={`badge ${
                          c.status === "Available"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td>{(c.issuedToStudent?.name && c.issuedToStudent?.campusId) || "-"}</td>

                    <td>
                      {c.dueDate
                        ? new Date(c.dueDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      {c.status === "Available" ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => issueCopyHandler(c._id)}
                        >
                          Issue
                        </button>
                      ) : (
                        <span className="text-muted">Issued</span>
                      )}
                    </td>
                  </tr>
                ))}

                {copies.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No copies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RETURN REQUESTS */}
      <div className="card p-3 mt-4 adminLibCard">
        <h5 className="fw-bold mb-3">Return Requests</h5>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Book</th>
                <th>CopyId</th>
                <th>Student</th>
                <th>CampusId</th>
                
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {returnRequests.map((r) => (
                <tr key={r._id}>
                  <td>{r.copy?.book?.title}</td>
                  <td className="fw-semibold">{r.copy?.copyId}</td>
                  <td>{r.student?.name}</td>
                  <td>{r.student?.campusId}</td>
                 
                  <td>
                    <span className="badge bg-warning text-dark">
                      {r.status}
                    </span>
                  </td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => acceptReturnHandler(r._id)}
                    >
                      Accept
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => rejectReturnHandler(r._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}

              {returnRequests.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No pending return requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLibrary;