import { useMemo, useState } from "react";

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

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              <i className="bi bi-cloud-upload-fill text-primary me-2"></i>
              Teacher Study Material Panel
            </h3>
            <div className="text-muted">
              Upload PDFs / Images for students
            </div>
          </div>

          <button className="btn btn-primary rounded-3">
            <i className="bi bi-arrow-clockwise me-2"></i>Refresh
          </button>
        </div>

        {/* UPLOAD */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-upload me-2 text-primary"></i>
              Upload New Material
            </h5>

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
                  <button className="btn btn-primary w-100 rounded-3 fw-bold">
                    Upload
                  </button>
                </div>
              </div>
            </form>
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

        {/* MATERIALS */}
        <div className="row g-4">
          {filteredMaterials.map((m) => (
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

                    <span className={`badge text-bg-${fileBadge(m.type)} rounded-pill`}>
                      {m.type.toUpperCase()}
                    </span>
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

                    <button
                      className="btn btn-outline-danger rounded-3"
                      onClick={() => handleDelete(m.id)}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Delete
                    </button>
                  </div>

                  <div className="text-muted small mt-3">
                    Uploaded: <b>{m.uploadedAt}</b>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
                <div className="p-3 bg-light rounded-4">
                  <div className="fw-semibold mb-1">Description</div>
                  <div className="text-muted">{selectedMaterial.description}</div>
                </div>

                <div className="p-3 border rounded-4 mt-3">
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

export default TStudyMaterial;
