import { useMemo, useState } from "react";

function Library() {
  // Demo Data (API se replace karna later)
  const books = [
    {
      id: 1,
      title: "Compiler Design",
      author: "Aho & Ullman",
      category: "Computer Science",
      bookId: "LIB-0001",
      status: "Available",
      description:
        "A complete reference for lexical analysis, parsing, syntax-directed translation, and code generation.",
    },
    {
      id: 2,
      title: "Database Management Systems",
      author: "Ramakrishnan",
      category: "Computer Science",
      bookId: "LIB-0002",
      status: "Issued",
      description:
        "Covers relational databases, SQL, normalization, indexing, transactions, and concurrency control.",
    },
    {
      id: 3,
      title: "Operating System Concepts",
      author: "Silberschatz",
      category: "Computer Science",
      bookId: "LIB-0003",
      status: "Available",
      description:
        "A strong foundation on processes, memory management, file systems, and CPU scheduling.",
    },
    {
      id: 4,
      title: "NCERT Physics (Class 12)",
      author: "NCERT",
      category: "School",
      bookId: "LIB-0104",
      status: "Issued",
      description:
        "NCERT Physics book for Class 12 students, useful for boards and competitive exams.",
    },
    {
      id: 5,
      title: "English Grammar",
      author: "Wren & Martin",
      category: "School",
      bookId: "LIB-0210",
      status: "Available",
      description:
        "A classic English grammar reference with exercises and clear explanations.",
    },
  ];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(books.map((b) => b.category)));
    return ["All", ...unique];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.bookId.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === "All" ? true : b.category === category;

      return matchSearch && matchCategory;
    });
  }, [search, category, books]);

  const statusBadge = (status) => {
    if (status === "Available") return "success";
    if (status === "Issued") return "danger";
    return "secondary";
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: 1150 }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              <i className="bi bi-book-half text-primary me-2"></i>
              Library
            </h3>
            <div className="text-muted">
              Search books, check availability & details
            </div>
          </div>

          <div className="d-flex gap-2">
            <a href="/" className="btn btn-outline-secondary rounded-3">
              <i className="bi bi-arrow-left me-2"></i>Back
            </a>

            <button className="btn btn-primary rounded-3">
              <i className="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="row g-3 align-items-center">
              {/* Search */}
              <div className="col-md-7">
                <label className="form-label fw-semibold">Search Book</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title, author, or book ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="col-md-5">
                <label className="form-label fw-semibold">
                  Filter by Category
                </label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="d-flex flex-wrap gap-2 mt-3">
              <span className="badge text-bg-light border text-dark px-3 py-2 rounded-pill">
                Total Books: <b>{books.length}</b>
              </span>

              <span className="badge text-bg-light border text-dark px-3 py-2 rounded-pill">
                Showing: <b>{filteredBooks.length}</b>
              </span>

              <span className="badge text-bg-light border text-dark px-3 py-2 rounded-pill">
                Category: <b>{category}</b>
              </span>
            </div>
          </div>
        </div>

        {/* Book List */}
        <div className="row g-4">
          {filteredBooks.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info rounded-4 border">
                <i className="bi bi-info-circle me-2"></i>
                No books found.
              </div>
            </div>
          ) : (
            filteredBooks.map((book) => (
              <div key={book.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <h5 className="fw-bold mb-1">{book.title}</h5>
                        <div className="text-muted small">
                          <i className="bi bi-person me-2"></i>
                          {book.author}
                        </div>
                        <div className="text-muted small">
                          <i className="bi bi-upc-scan me-2"></i>
                          {book.bookId}
                        </div>
                      </div>

                      <span
                        className={`badge text-bg-${statusBadge(
                          book.status
                        )} rounded-pill`}
                      >
                        {book.status}
                      </span>
                    </div>

                    <div className="mt-3">
                      <span className="badge text-bg-light border text-dark rounded-pill">
                        <i className="bi bi-tag me-1"></i>
                        {book.category}
                      </span>
                    </div>

                    <p className="text-muted mt-3 mb-0" style={{ lineHeight: 1.6 }}>
                      {book.description.length > 110
                        ? book.description.slice(0, 110) + "..."
                        : book.description}
                    </p>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        className="btn btn-outline-primary rounded-3"
                        onClick={() => setSelectedBook(book)}
                      >
                        View Details <i className="bi bi-arrow-right ms-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedBook && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{selectedBook.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedBook(null)}
                ></button>
              </div>

              <div className="modal-body pt-2">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge text-bg-light border text-dark rounded-pill">
                    <i className="bi bi-person me-1"></i>
                    {selectedBook.author}
                  </span>

                  <span className="badge text-bg-light border text-dark rounded-pill">
                    <i className="bi bi-tag me-1"></i>
                    {selectedBook.category}
                  </span>

                  <span className="badge text-bg-light border text-dark rounded-pill">
                    <i className="bi bi-upc-scan me-1"></i>
                    {selectedBook.bookId}
                  </span>

                  <span
                    className={`badge text-bg-${statusBadge(
                      selectedBook.status
                    )} rounded-pill`}
                  >
                    {selectedBook.status}
                  </span>
                </div>

                <div className="p-3 bg-light rounded-4" style={{ lineHeight: 1.7 }}>
                  {selectedBook.description}
                </div>

                {/* Extra Info Section */}
                <div className="mt-3 small text-muted">
                  <i className="bi bi-info-circle me-2"></i>
                  If book is issued, contact librarian for availability date.
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary rounded-3"
                  onClick={() => setSelectedBook(null)}
                >
                  Close
                </button>

                {selectedBook.status === "Available" ? (
                  <button className="btn btn-primary rounded-3">
                    <i className="bi bi-journal-arrow-up me-2"></i>
                    Issue Request
                  </button>
                ) : (
                  <button className="btn btn-outline-danger rounded-3" disabled>
                    <i className="bi bi-x-circle me-2"></i>
                    Not Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Library;
