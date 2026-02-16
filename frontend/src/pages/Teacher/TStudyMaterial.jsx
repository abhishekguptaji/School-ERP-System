import { useMemo, useState } from "react";
import "./css/TStudyMaterial.css";
function TStudyMaterial() {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: "Compiler Design - Unit 1 Notes",
      className: "B.Tech (Sem 5)",
      subject: "Compiler Design",
      type: "pdf",
      fileName: "unit1-notes.pdf",
      uploadedBy: "Mr. Sharma",
      uploadedAt: "2026-02-10",
      description: "Lexical analysis, tokens, regular expressions notes.",
    },
    {
      id: 2,
      title: "DBMS ER Diagram Examples",
      className: "B.Tech (Sem 4)",
      subject: "DBMS",
      type: "image",
      fileName: "er-diagram.png",
      uploadedBy: "Ms. Priya",
      uploadedAt: "2026-02-09",
      description: "ER diagram samples for practice.",
    },
  ]);

  const [uploadData, setUploadData] = useState({
    title: "",
    className: "",
    subject: "",
    description: "",
    file: null,
  });

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const classOptions = useMemo(() => {
    const unique = Array.from(new Set(materials.map((m) => m.className)));
    return ["All", ...unique];
  }, [materials]);

  const subjectOptions = useMemo(() => {
    const unique = Array.from(new Set(materials.map((m) => m.subject)));
    return ["All", ...unique];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        m.className.toLowerCase().includes(search.toLowerCase());

      const matchClass =
        filterClass === "All" ? true : m.className === filterClass;

      const matchSubject =
        filterSubject === "All" ? true : m.subject === filterSubject;

      return matchSearch && matchClass && matchSubject;
    });
  }, [materials, search, filterClass, filterSubject]);

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setUploadData({ ...uploadData, file: files[0] });
    } else {
      setUploadData({ ...uploadData, [name]: value });
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();

    if (!uploadData.file) {
      alert("Please select a PDF or Image file");
      return;
    }

    const fileType = uploadData.file.type.includes("pdf") ? "pdf" : "image";

    const newMaterial = {
      id: Date.now(),
      title: uploadData.title,
      className: uploadData.className,
      subject: uploadData.subject,
      type: fileType,
      fileName: uploadData.file.name,
      uploadedBy: "You (Teacher)",
      uploadedAt: new Date().toISOString().slice(0, 10),
      description: uploadData.description || "No description",
    };

    setMaterials([newMaterial, ...materials]);

    alert("Study material uploaded (demo)");

    setUploadData({
      title: "",
      className: "",
      subject: "",
      description: "",
      file: null,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this material?")) return;
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const fileBadge = (type) => {
    if (type === "pdf") return "danger";
    if (type === "image") return "success";
    return "secondary";
  };

  const fileIcon = (type) => {
    if (type === "pdf") return "bi-file-earmark-pdf-fill";
    if (type === "image") return "bi-image-fill";
    return "bi-file-earmark";
  };

  const stats = useMemo(() => {
    const total = materials.length;
    const pdf = materials.filter((m) => m.type === "pdf").length;
    const img = materials.filter((m) => m.type === "image").length;
    return { total, pdf, img };
  }, [materials]);

  return (
    <div className="container py-2">
      {/* TOP HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3 className="mb-0 fw-bold text-dark">
            Study Material
          </h3>
          
        </div>

        <button
          className="btn btn-outline-dark btn-sm"
          onClick={() => alert("Refresh (demo)")}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
      </div>

      {/* UPLOAD CARD */}
      <div className="erpProfileCard mt-3">
        <div className="p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h5 className="fw-bold mb-0">
                Upload New Material
              </h5>
              <div className="text-muted small">
                PDF / JPG / PNG supported
              </div>
            </div>

            <span className="badge bg-primary-subtle text-primary">
              Teacher Panel
            </span>
          </div>

          <form onSubmit={handleUploadSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={uploadData.title}
                  onChange={handleUploadChange}
                  placeholder="e.g. Unit 1 Notes"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Class</label>
                <input
                  type="text"
                  className="form-control"
                  name="className"
                  value={uploadData.className}
                  onChange={handleUploadChange}
                  placeholder="e.g. B.Tech (Sem 5)"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  value={uploadData.subject}
                  onChange={handleUploadChange}
                  placeholder="e.g. Compiler Design"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  Description (Optional)
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="description"
                  value={uploadData.description}
                  onChange={handleUploadChange}
                  placeholder="Short info about the material..."
                />
              </div>

              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Upload PDF / Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="file"
                  onChange={handleUploadChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
              </div>

              <div className="col-md-4 d-flex align-items-end">
                <button className="btn btn-primary w-100 fw-bold">
                  <i className="bi bi-upload me-2"></i>
                  Upload
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* FILTERS */}
      <div className="erpProfileCard mt-3">
        <div className="p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h5 className="fw-bold mb-0">
                <i className="bi bi-funnel me-2 text-primary"></i>
                Filter Materials
              </h5>
              <div className="text-muted small">
                Search by title, class or subject.
              </div>
            </div>

            <span className="text-muted small">
              Showing <b>{filteredMaterials.length}</b> results
            </span>
          </div>

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

      {/* MATERIALS LIST */}
      <div className="erpProfileCard mt-3">
        <div className="p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h5 className="fw-bold mb-0">
                <i className="bi bi-journal-text me-2 text-primary"></i>
                Uploaded Materials
              </h5>
              <div className="text-muted small">
                Manage uploaded files (demo).
              </div>
            </div>
          </div>

          {/* TABLE (Desktop) */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "35%" }}>Material</th>
                  <th style={{ width: "14%" }}>Class</th>
                  <th style={{ width: "14%" }}>Subject</th>
                  <th style={{ width: "10%" }}>Type</th>
                  <th style={{ width: "15%" }}>Uploaded</th>
                  <th style={{ width: "12%" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredMaterials.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="d-flex gap-3 align-items-start">
                        <div
                          className="rounded-3 d-flex align-items-center justify-content-center border bg-light"
                          style={{ width: 46, height: 46 }}
                        >
                          <i
                            className={`bi ${fileIcon(m.type)} fs-5 text-primary`}
                          ></i>
                        </div>

                        <div>
                          <div className="fw-bold">{m.title}</div>
                          <div className="text-muted small">
                            {m.fileName} • by <b>{m.uploadedBy}</b>
                          </div>
                          <div className="text-muted small">
                            {m.description?.length > 90
                              ? m.description.slice(0, 90) + "..."
                              : m.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="fw-semibold">{m.className}</td>
                    <td className="fw-semibold">{m.subject}</td>

                    <td>
                      <span
                        className={`badge text-bg-${fileBadge(
                          m.type
                        )} rounded-pill`}
                      >
                        {m.type.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div className="fw-semibold">{m.uploadedAt}</div>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedMaterial(m)}
                        >
                          <i className="bi bi-eye me-1"></i>
                          View
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(m.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredMaterials.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No materials found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="d-md-none">
            {filteredMaterials.length === 0 ? (
              <div className="text-center text-muted py-4">
                No materials found.
              </div>
            ) : (
              <div className="row g-3">
                {filteredMaterials.map((m) => (
                  <div className="col-12" key={m.id}>
                    <div className="erpMobileCard">
                      <div className="d-flex justify-content-between gap-2">
                        <div>
                          <div className="fw-bold">{m.title}</div>
                          <div className="text-muted small">
                            {m.className} • {m.subject}
                          </div>
                        </div>

                        <span
                          className={`badge text-bg-${fileBadge(
                            m.type
                          )} rounded-pill h-fit`}
                        >
                          {m.type.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-muted small mt-2">
                        {m.description?.length > 110
                          ? m.description.slice(0, 110) + "..."
                          : m.description}
                      </div>

                      <div className="text-muted small mt-2">
                        Uploaded: <b>{m.uploadedAt}</b>
                      </div>

                      <div className="d-flex gap-2 mt-3">
                        <button
                          className="btn btn-sm btn-outline-primary w-50"
                          onClick={() => setSelectedMaterial(m)}
                        >
                          <i className="bi bi-eye me-1"></i>
                          View
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger w-50"
                          onClick={() => handleDelete(m.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedMaterial && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold mb-0">
                    {selectedMaterial.title}
                  </h5>
                  <div className="text-muted small">
                    {selectedMaterial.className} • {selectedMaterial.subject}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedMaterial(null)}
                ></button>
              </div>

              <div className="modal-body pt-2">
                <div className="p-3 bg-light rounded-4">
                  <div className="fw-semibold mb-1">Description</div>
                  <div className="text-muted">
                    {selectedMaterial.description}
                  </div>
                </div>

                <div className="p-3 border rounded-4 mt-3">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                      <div className="fw-semibold">
                        File: {selectedMaterial.fileName}
                      </div>
                      <div className="text-muted small">
                        Uploaded: <b>{selectedMaterial.uploadedAt}</b> by{" "}
                        <b>{selectedMaterial.uploadedBy}</b>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={() => alert("Download (demo)")}
                    >
                      <i className="bi bi-download me-2"></i>
                      Download
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedMaterial(null)}
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
}

export default TStudyMaterial;