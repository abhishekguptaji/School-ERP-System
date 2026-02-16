import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./css/TAssignments.css";

function TAssignments(){
  // Demo assignments (teacher uploaded)
  const [assignments] = useState([
    {
      id: 1,
      title: "Compiler Design - Assignment 1",
      className: "B.Tech (Sem 5)",
      subject: "Compiler Design",
      teacher: "Mr. Sharma",
      givenAt: "2026-02-10",
      dueDate: "2026-02-20",
      instructions: "Solve Unit-1 questions. Submit PDF only.",
    },
    {
      id: 2,
      title: "DBMS - ER Diagram Task",
      className: "B.Tech (Sem 4)",
      subject: "DBMS",
      teacher: "Ms. Priya",
      givenAt: "2026-02-09",
      dueDate: "2026-02-18",
      instructions: "Create ER diagram for Library Management System.",
    },
  ]);

  // Demo submissions by student
  const [submissions, setSubmissions] = useState([
    {
      id: 101,
      assignmentId: 1,
      fileName: "assignment1.pdf",
      submittedAt: "2026-02-12",
      status: "Submitted", // Submitted | Checked | Rejected
      remark: "",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");
  const [selected, setSelected] = useState(null);

  const [uploadData, setUploadData] = useState({
    assignmentId: "",
    file: null,
    note: "",
  });

  const classOptions = useMemo(() => {
    const unique = Array.from(new Set(assignments.map((a) => a.className)));
    return ["All", ...unique];
  }, [assignments]);

  const subjectOptions = useMemo(() => {
    const unique = Array.from(new Set(assignments.map((a) => a.subject)));
    return ["All", ...unique];
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.subject.toLowerCase().includes(search.toLowerCase()) ||
        a.className.toLowerCase().includes(search.toLowerCase());

      const matchClass =
        filterClass === "All" ? true : a.className === filterClass;

      const matchSubject =
        filterSubject === "All" ? true : a.subject === filterSubject;

      return matchSearch && matchClass && matchSubject;
    });
  }, [assignments, search, filterClass, filterSubject]);

  const getSubmissionFor = (assignmentId) => {
    return submissions.find((s) => s.assignmentId === assignmentId);
  };

  const dueBadge = (dueDate) => {
    const due = new Date(dueDate).getTime();
    const now = Date.now();
    const days = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: `${Math.abs(days)} days late`, cls: "bg-danger" };
    if (days <= 2) return { text: `${days} days left`, cls: "bg-warning text-dark" };
    return { text: `${days} days left`, cls: "bg-success" };
  };

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setUploadData({ ...uploadData, file: files[0] });
    } else {
      setUploadData({ ...uploadData, [name]: value });
    }
  };

  const submitAssignment = async (e) => {
    e.preventDefault();

    if (!uploadData.assignmentId) {
      Swal.fire("Error", "Please select an assignment", "error");
      return;
    }

    if (!uploadData.file) {
      Swal.fire("Error", "Please select a file", "error");
      return;
    }

    // Demo only
    const already = submissions.find(
      (s) => s.assignmentId === Number(uploadData.assignmentId)
    );

    if (already) {
      Swal.fire("Error", "You already submitted this assignment", "error");
      return;
    }

    const newSubmission = {
      id: Date.now(),
      assignmentId: Number(uploadData.assignmentId),
      fileName: uploadData.file.name,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: "Submitted",
      remark: uploadData.note || "",
    };

    setSubmissions([newSubmission, ...submissions]);

    Swal.fire("Success", "Assignment submitted (demo)", "success");

    setUploadData({
      assignmentId: "",
      file: null,
      note: "",
    });
  };

  const submissionBadge = (status) => {
    if (status === "Submitted") return "bg-primary-subtle text-primary";
    if (status === "Checked") return "bg-success-subtle text-success";
    if (status === "Rejected") return "bg-danger-subtle text-danger";
    return "bg-secondary-subtle text-secondary";
  };

  return (
    <div className="container py-2">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3 className="mb-0 fw-bold text-dark">
            Upload Assignment
          </h3>
        </div>

        <button
          className="btn btn-outline-dark btn-sm"
          onClick={() => Swal.fire("Info", "This is demo UI only", "info")}
        >
          <i className="bi bi-info-circle me-1"></i>
          Info
        </button>
      </div>

      {/* UPLOAD */}
      <div className="erpProfileCard mt-3">
        <div className="p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h5 className="fw-bold mb-0">
                <i className="bi bi-upload me-2 text-primary"></i>
                Submit Assignment
              </h5>
              <div className="text-muted small">
                PDF / DOCX / JPG / PNG allowed.
              </div>
            </div>
          </div>

          <form onSubmit={submitAssignment}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Select Assignment</label>
                <select
                  className="form-select"
                  name="assignmentId"
                  value={uploadData.assignmentId}
                  onChange={handleUploadChange}
                >
                  <option value="">-- Select --</option>
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Upload File</label>
                <input
                  type="file"
                  className="form-control"
                  name="file"
                  onChange={handleUploadChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Note (Optional)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="note"
                  value={uploadData.note}
                  onChange={handleUploadChange}
                  placeholder="Any note for teacher..."
                />
              </div>

              <div className="col-12">
                <button className="btn btn-primary fw-bold">
                  <i className="bi bi-send me-2"></i>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* FILTERS */}
      <div className="erpProfileCard mt-3">
        <div className="p-3 p-md-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  className="form-control"
                  placeholder="Search by title / class / subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Class</label>
              <select
                className="form-select"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Subject</label>
              <select
                className="form-select"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="erpProfileCard mt-3">
        <div className="p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h5 className="fw-bold mb-0">
                <i className="bi bi-list-check me-2 text-primary"></i>
                Assignments List
              </h5>
              <div className="text-muted small">
                Upload your file before due date.
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Assignment</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAssignments.map((a) => {
                  const sub = getSubmissionFor(a.id);
                  const due = dueBadge(a.dueDate);

                  return (
                    <tr key={a.id}>
                      <td>
                        <div className="fw-bold">{a.title}</div>
                        <div className="text-muted small">
                          Teacher: <b>{a.teacher}</b>
                        </div>
                      </td>

                      <td className="fw-semibold">{a.className}</td>
                      <td className="fw-semibold">{a.subject}</td>

                      <td>
                        <div className="fw-semibold">
                          {new Date(a.dueDate).toLocaleDateString()}
                        </div>
                        <span className={`badge ${due.cls} mt-1`}>
                          {due.text}
                        </span>
                      </td>

                      <td>
                        {sub ? (
                          <span className={`badge ${submissionBadge(sub.status)}`}>
                            {sub.status}
                          </span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning">
                            Not Submitted
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelected(a)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </button>

                          {!sub && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                setUploadData({
                                  ...uploadData,
                                  assignmentId: String(a.id),
                                })
                              }
                            >
                              <i className="bi bi-upload me-1"></i>
                              Upload
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredAssignments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No assignments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="d-md-none">
            {filteredAssignments.length === 0 ? (
              <div className="text-center text-muted py-4">
                No assignments found
              </div>
            ) : (
              <div className="row g-3">
                {filteredAssignments.map((a) => {
                  const sub = getSubmissionFor(a.id);
                  const due = dueBadge(a.dueDate);

                  return (
                    <div className="col-12" key={a.id}>
                      <div className="erpMobileCard">
                        <div className="d-flex justify-content-between gap-2">
                          <div>
                            <div className="fw-bold">{a.title}</div>
                            <div className="text-muted small">
                              {a.className} • {a.subject}
                            </div>
                          </div>

                          {sub ? (
                            <span className={`badge ${submissionBadge(sub.status)} h-fit`}>
                              {sub.status}
                            </span>
                          ) : (
                            <span className="badge bg-warning-subtle text-warning h-fit">
                              Not Submitted
                            </span>
                          )}
                        </div>

                        <div className="mt-2">
                          <div className="text-muted small">Due Date</div>
                          <div className="fw-semibold">
                            {new Date(a.dueDate).toLocaleDateString()}
                          </div>
                          <span className={`badge ${due.cls} mt-1`}>
                            {due.text}
                          </span>
                        </div>

                        <div className="d-flex gap-2 mt-3">
                          <button
                            className="btn btn-sm btn-outline-primary w-50"
                            onClick={() => setSelected(a)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </button>

                          {!sub && (
                            <button
                              className="btn btn-sm btn-primary w-50"
                              onClick={() =>
                                setUploadData({
                                  ...uploadData,
                                  assignmentId: String(a.id),
                                })
                              }
                            >
                              <i className="bi bi-upload me-1"></i>
                              Upload
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold mb-0">{selected.title}</h5>
                  <div className="text-muted small">
                    {selected.className} • {selected.subject} • Teacher:{" "}
                    <b>{selected.teacher}</b>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelected(null)}
                ></button>
              </div>

              <div className="modal-body pt-2">
                <div className="p-3 bg-light rounded-4">
                  <div className="fw-semibold mb-1">Instructions</div>
                  <div className="text-muted">{selected.instructions}</div>
                </div>

                <div className="p-3 border rounded-4 mt-3">
                  <div className="fw-semibold mb-2">Dates</div>
                  <div className="text-muted">
                    Given: <b>{selected.givenAt}</b> <br />
                    Due: <b>{selected.dueDate}</b>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TAssignments ;