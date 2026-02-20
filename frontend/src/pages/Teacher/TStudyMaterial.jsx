import {
  getMyAllocations,
  uploadStudyMaterial,
  getMyStudyMaterials,
  deleteStudyMaterial,
} from "../../services/teacherService.js";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./css/TStudyMaterial.css";

function TStudyMaterial() {
  const [materials, setMaterials] = useState([]);
  const [allocations, setAllocations] = useState([]);

  const [uploadData, setUploadData] = useState({
    title: "",
    classId: "",
    subjectId: "",
    description: "",
    file: null,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMaterials();
    fetchAllocations();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await getMyStudyMaterials();
      setMaterials(res.data.materials || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch materials", "error");
    }
  };

  const fetchAllocations = async () => {
    try {
      const res = await getMyAllocations();
      setAllocations(res.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch allocations", "error");
    }
  };

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setUploadData({ ...uploadData, file: files[0] });
    } else {
      setUploadData({ ...uploadData, [name]: value });
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!uploadData.file) {
      return Swal.fire(
        "File Required",
        "Please select a file to upload.",
        "warning"
      );
    }

    const formData = new FormData();
    formData.append("title", uploadData.title);
    formData.append("classId", uploadData.classId);
    formData.append("subjectId", uploadData.subjectId);
    formData.append("description", uploadData.description);
    formData.append("file", uploadData.file);

    try {
      setLoading(true);
      await uploadStudyMaterial(formData);

      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: "Study material uploaded successfully.",
        timer: 1200,
        showConfirmButton: false,
      });

      setUploadData({
        title: "",
        classId: "",
        subjectId: "",
        description: "",
        file: null,
      });

      fetchMaterials();
    } catch (err) {
      Swal.fire(
        "Upload Failed",
        err.response?.data?.message || "Upload failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this material?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteStudyMaterial(id);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1000,
        showConfirmButton: false,
      });

      fetchMaterials();
    } catch (err) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) =>
      m.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [materials, search]);

  return (
    <div className="container py-3 teacher-theme">
      {/* HEADER */}
      <div className="teacher-header mb-3">
        <h3 className="fw-bold">Study Material Management</h3>
        <div className="small">Upload and manage class materials</div>
      </div>

      {/* UPLOAD CARD */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <h5 className="fw-bold mb-3 text-primary">
            <i className="bi bi-upload me-2"></i>
            Upload Study Material
          </h5>

          <form onSubmit={handleUploadSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Title"
                  value={uploadData.title}
                  onChange={handleUploadChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  name="classId"
                  value={uploadData.classId}
                  onChange={handleUploadChange}
                  required
                >
                  <option value="">Select Class</option>
                  {allocations.map((a) => (
                    <option key={a.classId._id} value={a.classId._id}>
                      {a.classId.className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  name="subjectId"
                  value={uploadData.subjectId}
                  onChange={handleUploadChange}
                  required
                >
                  <option value="">Select Subject</option>
                  {allocations
                    .filter((a) => a.classId._id === uploadData.classId)
                    .map((a) => (
                      <option key={a.subjectId._id} value={a.subjectId._id}>
                        {a.subjectId.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-12">
                <textarea
                  className="form-control"
                  rows="2"
                  name="description"
                  placeholder="Description"
                  value={uploadData.description}
                  onChange={handleUploadChange}
                />
              </div>

              <div className="col-md-8">
                <input
                  type="file"
                  className="form-control"
                  name="file"
                  onChange={handleUploadChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <button className="btn btn-primary w-100 fw-bold">
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* MATERIAL LIST */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {filteredMaterials.length === 0 ? (
            <div className="text-center text-muted">
              No materials found
            </div>
          ) : (
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <div className="fw-bold">{m.title}</div>
                      <div className="text-muted small">
                        {m.description || "No description"}
                      </div>
                    </td>

                    <td>{m.classId?.className}</td>
                    <td>{m.subjectId?.name}</td>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>

                    <td>
                      <div className="d-flex gap-2">
                        <a
                          href={m.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View
                        </a>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(m._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default TStudyMaterial;