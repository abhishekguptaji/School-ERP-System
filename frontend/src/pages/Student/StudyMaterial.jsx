import { useEffect, useMemo, useState } from "react";
import { studentgetStudyMaterial } from "../../services/authService.js";

function StudyMaterial() {
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await studentgetStudyMaterial();
      const apiData = res.data || [];

      const formatted = apiData.map((m) => ({
        id: m._id,
        title: m.title,
        subject: m.subjectId?.name || "N/A",
        description: m.description,
        type: m.fileType,
        fileName: m.fileName,
        fileUrl: m.fileUrl,
        uploadedAt: m.createdAt.split("T")[0],
      }));

      setMaterials(formatted);
    } catch (err) {
      console.error("Error fetching materials", err);
    } finally {
      setLoading(false);
    }
  };

  const subjectOptions = useMemo(() => {
    const unique = Array.from(new Set(materials.map((m) => m.subject)));
    return ["All", ...unique];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase());

      const matchSubject =
        filterSubject === "All" ? true : m.subject === filterSubject;

      return matchSearch && matchSubject;
    });
  }, [materials, search, filterSubject]);

  const fileIcon = (type) => {
    if (type === "pdf") return "bi-file-earmark-pdf-fill text-danger";
    if (type === "jpeg" || type === "jpg" || type === "png")
      return "bi-image-fill text-success";
    return "bi-file-earmark text-secondary";
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container px-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">
              Study Materials
            </h4>
            <small className="text-muted">
              Download materials uploaded by teachers
            </small>
          </div>
        </div>

        {/* FILTERS */}
        <div className="card shadow-sm border-0 rounded-3 mb-4 p-3">
          <div className="row g-3">
            <div className="col-md-8">
              <input
                className="form-control"
                placeholder="Search by title or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                {subjectOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* MATERIAL LIST */}
        <div className="row g-4">
          {filteredMaterials.length === 0 ? (
            <div className="text-center text-muted py-4">
              No study materials found.
            </div>
          ) : (
            filteredMaterials.map((m) => (
              <div key={m.id} className="col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 rounded-3 h-100 p-3">

                  <div className="d-flex align-items-start gap-3">
                    <i className={`bi ${fileIcon(m.type)} fs-2`} />

                    <div>
                      <h6 className="fw-bold mb-1">{m.title}</h6>
                      <div className="text-muted small">{m.subject}</div>
                      <div className="text-muted small">
                        Uploaded: {m.uploadedAt}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted small mt-3">
                    {m.description.length > 80
                      ? m.description.slice(0, 80) + "..."
                      : m.description}
                  </p>

                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedMaterial(m)}
                    >
                      View
                    </button>

                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <i className="bi bi-download me-1"></i>
                      Download
                    </a>
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
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 border-0">
              <div className="modal-header border-0">
                <h6 className="fw-bold">{selectedMaterial.title}</h6>
                <button
                  className="btn-close"
                  onClick={() => setSelectedMaterial(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p>{selectedMaterial.description}</p>

                <a
                  href={selectedMaterial.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  Download File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyMaterial;