import { useMemo, useState } from "react";

function StudyMaterial() {
  const [materials] = useState([
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

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              <i className="bi bi-journal-bookmark-fill text-primary me-2"></i>
              Study Materials
            </h3>
            <div className="text-muted">
              Download PDF and Images uploaded by teachers
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3 p-md-4">
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

        {/* MATERIAL LIST */}
        <div className="row g-4">
          {filteredMaterials.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info rounded-4 border">
                <i className="bi bi-info-circle me-2"></i>
                No study materials found.
              </div>
            </div>
          ) : (
            filteredMaterials.map((m) => (
              <div key={m.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between gap-3">
                      <div className="d-flex gap-3">
                        <div
                          className="rounded-3 d-flex align-items-center justify-content-center bg-light border"
                          style={{ width: 52, height: 52 }}
                        >
                          <i className={`bi ${fileIcon(m.type)} fs-4 text-primary`} />
                        </div>

                        <div>
                          <h6 className="fw-bold mb-1">{m.title}</h6>
                          <div className="text-muted small">{m.className}</div>
                          <div className="text-muted small">{m.subject}</div>
                        </div>
                      </div>

                    </div>

                    <p className="text-muted mt-3 mb-0">
                      {m.description.length > 90
                        ? m.description.slice(0, 90) + "..."
                        : m.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <button
                        className="btn btn-outline-primary rounded-3"
                        onClick={() => setSelectedMaterial(m)}
                      >
                        View <i className="bi bi-eye ms-1"></i>
                      </button>

                      <button className="btn btn-primary rounded-3">
                        <i className="bi bi-download me-2"></i>
                        Download
                      </button>
                    </div>

                    <div className="text-muted small mt-3">
                      Uploaded: <b>{m.uploadedAt}</b> • By <b>{m.uploadedBy}</b>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
                <h5 className="modal-title fw-bold">
                  {selectedMaterial.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedMaterial(null)}
                ></button>
              </div>

              <div className="modal-body pt-2">
                <div className="p-3 bg-light rounded-4 mb-3">
                  <div className="fw-semibold mb-1">Description</div>
                  <div className="text-muted">{selectedMaterial.description}</div>
                </div>

                <div className="p-3 border rounded-4">
                  <div className="fw-semibold mb-2">
                    File: {selectedMaterial.fileName}
                  </div>

                  <button className="btn btn-primary rounded-3">
                    <i className="bi bi-download me-2"></i>
                    Download
                  </button>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary rounded-3"
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

export default   StudyMaterial;
