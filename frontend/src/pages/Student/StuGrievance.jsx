import "./css/StuGrievance.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getShortProfileStudent,
  createMyGrievance,
  getMyGrievance,
} from "../../services/authService.js";

function StuGrievance() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const [applyForm, setapplyForm] = useState([]);
  const [fileKey, setFileKey] = useState(Date.now());

  const [formData, setFormData] = useState({
    formTitle: "",
    formCategory: "",
    formPriority: "medium",
    formDescription: "",
    formAttachement: null,
  });

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getShortProfileStudent();

      if (!res?.success) {
        setError(res?.message || "Failed to load student data");
        setLoading(false);
        return;
      }

      setStudent(res?.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGrievances = async () => {
    try {
      const res = await getMyGrievance();
      if (res?.success) setapplyForm(res?.data || []);
    } catch (err) {
      console.log("FETCH GRIEVANCE ERROR:", err);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchMyGrievances();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      formAttachement: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.formTitle.trim()) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }

    if (!formData.formCategory) {
      Swal.fire("Error", "Category is required", "error");
      return;
    }

    if (!formData.formDescription.trim()) {
      Swal.fire("Error", "Description is required", "error");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("title", formData.formTitle.trim());
      payload.append("category", formData.formCategory);
      payload.append("priority", formData.formPriority);
      payload.append("description", formData.formDescription.trim());

      if (formData.formAttachement) {
        payload.append("attachment", formData.formAttachement);
      }

      const res = await createMyGrievance(payload);

      if (!res?.success) {
        Swal.fire("Error", res?.message || "Failed to create grievance", "error");
        return;
      }

      Swal.fire("Success", res?.message || "Grievance created", "success");

      setFormData({
        formTitle: "",
        formCategory: "",
        formPriority: "medium",
        formDescription: "",
        formAttachement: null,
      });

      setFileKey(Date.now());
      await fetchMyGrievances();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <div className="mt-2 fw-semibold">Loading Grievances...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stuGErrorWrap">
        <div className="stuGErrorCard">
          <div className="stuGErrorIcon">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>

          <h4 className="fw-bold mb-1">Complete The Profile First</h4>
          <p className="text-muted mb-3">{error}</p>

          <button className="stuGRetryBtn" onClick={fetchStudent}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const user = student?.user;
  const applydata = applyForm || [];

  return (
    <div className="stuGPage">
      <div className="container-fluid stuGContainer">
        {/* PAGE HEADER */}
        <div className="stuGHeader d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="mb-1">
              Student Grievance
            </h3>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary px-4"
            onClick={() => {
              fetchStudent();
              fetchMyGrievances();
            }}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>

        {/* TOP SECTION */}
        <div className="row g-4 mb-4">
          {/* STUDENT CARD */}
          <div className="col-12 col-lg-4">
            <div className="card stuGTopCard h-100">
              <div className="stuGTopCardHeader">
                <div className="d-flex align-items-center gap-3">
                  <div className="stuGAvatar">
                    <img
                      src={student?.userImage || "/default-user.png"}
                      alt="student"
                    />
                  </div>

                  <div>
                    <div className="stuGName">{user?.name || "-"}</div>
                    <div className="stuGEmail">{user?.email || "-"}</div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="d-flex flex-column gap-3">
                  <div className="stuGInfoBox">
                    <div className="stuGInfoLabel">Campus ID</div>
                    <div className="stuGInfoValue">{user?.campusId || "-"}</div>
                  </div>

                  <div className="stuGInfoBox">
                    <div className="stuGInfoLabel">Father Mobile</div>
                    <div className="stuGInfoValue">
                      {student?.father?.phone || "-"}
                    </div>
                  </div>

                  <div className="stuGAlert">
                    <i className="bi bi-info-circle me-2"></i>
                    Attachments can be images (jpg/png).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CREATE GRIEVANCE FORM */}
          <div className="col-12 col-lg-8">
            <div className="card stuGCard h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                  <h5 className="mb-0">
                    <i className="bi bi-pencil-square text-primary me-2"></i>
                    Create Grievance
                  </h5>

                  <span className="badge text-bg-light border text-dark rounded-pill px-3 py-2">
                    <i className="bi bi-shield-check me-2"></i>
                    Secure Ticket System
                  </span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control"
                        name="formTitle"
                        value={formData.formTitle}
                        onChange={handleChange}
                        placeholder="Enter title of complaint..."
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        name="formCategory"
                        value={formData.formCategory}
                        onChange={handleChange}
                      >
                        <option value="">Select category</option>
                        <option value="transport">Transport</option>
                        <option value="fees">Fees</option>
                        <option value="exam">Exam</option>
                        <option value="facility">Facility</option>
                        <option value="technical">Technical</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        name="formPriority"
                        value={formData.formPriority}
                        onChange={handleChange}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label">Attachment</label>
                      <input
                        className="form-control"
                        type="file"
                        key={fileKey}
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="formDescription"
                        value={formData.formDescription}
                        onChange={handleChange}
                        placeholder="Write your grievance in detail..."
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary px-5 py-2 fw-semibold"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill me-2"></i>
                          Submit Grievance
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* MY GRIEVANCES */}
        <div className="card stuGCard">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <h5 className="mb-0">
                <i className="bi bi-list-check text-primary me-2"></i>
                My Grievances
              </h5>

              <span className="badge text-bg-light border text-dark rounded-pill px-3 py-2">
                Total: <b>{applydata?.length || 0}</b>
              </span>
            </div>

            {applydata?.length === 0 ? (
              <div className="alert alert-info rounded-4 border mb-0 text-center">
                <i className="bi bi-info-circle me-2"></i>
                No grievances found. Submit your first complaint.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 stuGTable">
                  <thead>
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>Ticket</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th style={{ whiteSpace: "nowrap" }}>Created</th>
                      <th className="text-end">Attachment</th>
                    </tr>
                  </thead>

                  <tbody>
                    {applydata.map((g) => {
                      const priorityColor =
                        g.priority === "high"
                          ? "danger"
                          : g.priority === "medium"
                          ? "warning"
                          : "success";

                      const statusColor =
                        g.status === "pending"
                          ? "secondary"
                          : g.status === "in_progress"
                          ? "primary"
                          : g.status === "resolved"
                          ? "success"
                          : g.status === "rejected"
                          ? "danger"
                          : "dark";

                      return (
                        <tr key={g._id}>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <span className="badge text-bg-light border text-primary rounded-pill">
                              {g.ticketId || "-"}
                            </span>
                          </td>

                          <td style={{ minWidth: 280 }}>
                            <div className="fw-semibold">{g.title || "-"}</div>
                            <div className="text-muted small">
                              {(g.description || "").slice(0, 70)}
                              {(g.description || "").length > 70 ? "..." : ""}
                            </div>
                          </td>

                          <td className="text-capitalize">
                            <span className="badge text-bg-light border text-dark rounded-pill">
                              {g.category || "-"}
                            </span>
                          </td>

                          <td className="text-capitalize">
                            <span
                              className={`badge text-bg-${priorityColor} rounded-pill`}
                            >
                              {g.priority || "-"}
                            </span>
                          </td>

                          <td className="text-capitalize">
                            <span
                              className={`badge text-bg-${statusColor} rounded-pill`}
                            >
                              {g.status || "-"}
                            </span>
                          </td>

                          <td style={{ whiteSpace: "nowrap" }}>
                            <span className="text-muted small">
                              {g.createdAt
                                ? new Date(g.createdAt).toLocaleString()
                                : "-"}
                            </span>
                          </td>

                          <td className="text-end">
                            {g.attachment?.fileUrl ? (
                              <a
                                href={g.attachment.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-primary btn-sm rounded-3"
                              >
                                <i className="bi bi-eye me-1"></i>
                                View
                              </a>
                            ) : (
                              <span className="text-muted">No File</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="small text-muted mt-2">
              <i className="bi bi-lightbulb me-2"></i>
              Tip: Your grievance status will update once admin/teacher responds.
            </div>
          </div>
        </div>

        <div style={{ height: 10 }}></div>
      </div>
    </div>
  );
}

export default StuGrievance;