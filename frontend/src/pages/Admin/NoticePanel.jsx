import "./css/NoticePanel.css";
import { useState, useEffect } from "react";
import {
  createNoticesByAdmin,
  getAdminNotice,
  deleteNotice,
} from "../../services/adminService.js";
import Swal from "sweetalert2";
function NoticePanel() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fileKey, setFileKey] = useState(Date.now());
  const [error, setError] = useState("");
  const [applyNotice, setapplyNotice] = useState([]);

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    publishAt: getTodayDate(),
    title: "",
    category: "",
    audience: "All",
    priority: "Low",
    description: "",
    attachement: null,
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminNotice();
      // console.log(res?.data);
      if (!res?.success) {
        setError(res?.message || "Failed to load notices");
        return;
      }
      setapplyNotice(res?.data || []);
    } catch (err) {
      console.log(err);
      setError("Something went wrong while loading notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      attachement: file,
    }));
  };

  const handleDelete = async (id) => {
  await deleteNotice(id);
  setData((prev) => prev.filter((n) => n._id !== id));
};


  // ===================== SUBMIT =====================
  const handleCreateNotice = async (e) => {
    e.preventDefault();

    try {
      if (!formData.title.trim())
        return Swal.fire("Error", "Title is required", "error");
      if (!formData.category)
        return Swal.fire("Error", "Category is required", "error");
      if (!formData.audience)
        return Swal.fire("Error", "Audience is required", "error");
      if (!formData.priority)
        return Swal.fire("Error", "Priority is required", "error");

      setSubmitting(true);

      const fd = new FormData();
      fd.append("publishAt", formData.publishAt);
      fd.append("title", formData.title);
      fd.append("category", formData.category);
      fd.append("audience", formData.audience);
      fd.append("priority", formData.priority);
      fd.append("description", formData.description);

      if (formData.attachement) {
        fd.append("attachement", formData.attachement);
      }

      const res = await createNoticesByAdmin(fd);

      if (!res?.success) {
        Swal.fire("Error", res?.message || "Failed to publish notice", "error");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Published",
        text: "Notice created successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      // reset
      setFormData({
        publishAt: getTodayDate(),
        title: "",
        category: "",
        audience: "All",
        priority: "Low",
        description: "",
        attachement: null,
      });

      setFileKey(Date.now());
      fetchNotices();
    } catch (err) {
      console.log(err);
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Something went wrong",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ===================== UI =====================
  if (loading) return <div className="dash-loading">Loading notices...</div>;

  return (
    <div className="adminNoticePage">
      <div className="container py-4" style={{ maxWidth: 1250 }}>
        

        {error && (
          <div className="alert alert-danger rounded-4 border mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <div className="row g-4">
          {/* ===================== LEFT: CREATE ===================== */}
          <div className="col-12 col-lg-5">
            <div className="card noticeCreateCard border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-plus-circle-fill me-2 text-primary"></i>
                    Create Notice
                  </h5>
                  <span className="badge text-bg-light border text-dark rounded-pill px-3 py-2">
                    Live Publish
                  </span>
                </div>

                <form onSubmit={handleCreateNotice}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Title</label>
                    <input
                      type="text"
                      className="form-control noticeInput"
                      placeholder="e.g. Unit Test Notice"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Publish Date
                      </label>
                      <input
                        type="date"
                        className="form-control noticeInput"
                        name="publishAt"
                        value={formData.publishAt}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Category</label>
                      <select
                        className="form-select noticeInput"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">Select Category</option>
                        <option value="Academic">Academic</option>
                        <option value="General">General</option>
                        <option value="Exam">Exam</option>
                        <option value="Holiday">Holiday</option>
                        <option value="Fee">Fee</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Audience</label>
                      <select
                        className="form-select noticeInput"
                        name="audience"
                        value={formData.audience}
                        onChange={handleChange}
                      >
                        <option value="All">All</option>
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Priority</label>
                      <select
                        className="form-select noticeInput"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="Low">Low</option>
                        <option value="Important">Important</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Attachment (Optional)
                    </label>
                    <input
                      type="file"
                      key={fileKey}
                      className="form-control noticeInput"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <small className="text-muted">Allowed: PDF, JPG, PNG</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      className="form-control noticeInput"
                      rows="5"
                      placeholder="Write full notice..."
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 noticeBtn"
                    disabled={submitting}
                  >
                    {submitting ? "Publishing..." : "Publish Notice"}
                    <i className="bi bi-send-fill ms-2"></i>
                  </button>

                  <div className="noticeHint mt-3">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    Students and teachers will see this notice instantly.
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* ===================== RIGHT: LIST ===================== */}
          <div className="col-12 col-lg-7">
            <div className="card noticeListCard border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-list-check me-2 text-primary"></i>
                    All Notices
                  </h5>

                  <span className="badge text-bg-light border text-dark rounded-pill px-3 py-2">
                    Total: <b>{applyNotice.length}</b>
                  </span>
                </div>

                {applyNotice.length === 0 ? (
                  <div className="alert alert-info rounded-4 mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    No notices created yet.
                  </div>
                ) : (
                  <div className="noticeList">
                    {applyNotice.map((n) => (
                      <div key={n._id} className="noticeItem">
                        <div className="noticeTop">
                          <div>
                            <div className="noticeTitle">{n.title}</div>
                            <div className="noticeMeta">
                              <span>
                                <i className="bi bi-calendar-event me-1"></i>
                                {n.createdAt
                                  ? new Date(n.createdAt).toLocaleDateString()
                                  : "-"}
                              </span>
                              <span>
                                <i className="bi bi-person me-1"></i>
                                {n.createdBy?.name || "Admin"}
                              </span>
                            </div>
                          </div>

                          <div className="noticeBadges">
                            <span
                              className={`badge ${badgeCategory(n.category)}`}
                            >
                              {n.category}
                            </span>

                            <span
                              className={`badge ${badgePriority(n.priority)}`}
                            >
                              {n.priority}
                            </span>

                            <span className="badge bg-dark">{n.audience}</span>
                          </div>
                        </div>

                        {n.description && (
                          <div className="noticeDesc">{n.description}</div>
                        )}

                        {/* attachment */}
                        <div className="noticeBottom">
                          {n?.attachement?.[0]?.fileUrl ? (
                            <a
                              href={n.attachement[0].fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-primary rounded-3"
                            >
                              <i className="bi bi-paperclip me-2"></i>
                              View Attachment
                            </a>
                          ) : (
                            <span className="text-muted small">
                              No attachment
                            </span>
                          )}
                          <button
  className="btn btn-sm btn-danger"
  onClick={() => handleDelete(n._id)}
>
  Delete
</button>


                          <span
                            className={`noticeActive ${n.isActive ? "on" : "off"}`}
                          >
                            {n.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticePanel;

/* ===================== helpers ===================== */
function badgeCategory(cat) {
  if (cat === "Exam") return "bg-danger";
  if (cat === "Holiday") return "bg-success";
  if (cat === "Fee") return "bg-warning text-dark";
  if (cat === "Academic") return "bg-primary";
  return "bg-secondary";
}

function badgePriority(p) {
  if (p === "Urgent") return "bg-danger";
  if (p === "Important") return "bg-warning text-dark";
  return "bg-success";
}
