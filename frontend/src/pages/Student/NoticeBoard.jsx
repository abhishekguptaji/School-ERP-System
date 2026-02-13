import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { getStudentNotices } from "../../services/authService.js";
import "./css/TeacherNotice.css";

const PRIORITY_BADGE = {
  Normal: "bg-secondary",
  Important: "bg-warning text-dark",
  Urgent: "bg-danger",
};

function NoticeBoard() {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getStudentNotices();

      if (!res?.success) {
        setError(res?.message || "Failed to fetch notices");
        setLoading(false);
        return;
      }

      setNotices(res?.data || []);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Something went wrong while fetching notices");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notices;

    return notices.filter((n) => {
      const title = (n?.title || "").toLowerCase();
      const desc = (n?.description || "").toLowerCase();
      const category = (n?.category || "").toLowerCase();
      const priority = (n?.priority || "").toLowerCase();
      const audience = (n?.audience || "").toLowerCase();

      return (
        title.includes(q) ||
        desc.includes(q) ||
        category.includes(q) ||
        priority.includes(q) ||
        audience.includes(q)
      );
    });
  }, [notices, search]);

  if (loading) {
    return (
      <div className="container">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">Loading notices...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger rounded-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <b>Error:</b> {error}
          </div>
          <button className="btn btn-dark rounded-3" onClick={fetchNotices}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container tn-wrap">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h3 className="fw-bold mb-0">Notices</h3>
        </div>

        <button className="btn btn-outline-dark rounded-3" onClick={fetchNotices}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-body p-3">
          <div className="tn-search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search by title, description, category, priority..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* COUNT */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <small className="text-muted">
          Showing <b>{filteredNotices.length}</b> of <b>{notices.length}</b>
        </small>
      </div>

      {/* LIST */}
      {filteredNotices.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 text-center">
            <h5 className="fw-bold mb-1">No notices found</h5>
            <p className="text-muted mb-0">
              Try searching with different keywords.
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {filteredNotices.map((notice) => {
            const attachments = notice?.attachement || [];
            const publishDate = notice?.publishAt
              ? new Date(notice.publishAt).toLocaleDateString()
              : "N/A";

            return (
<div className="col-6" key={notice._id}>
  <div className="card border-0 shadow-sm rounded-4 tn-card">
    <div className="card-body p-4">
      {/* TOP */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h5 className="fw-bold mb-1">{notice?.title || "-"}</h5>

          <div className="d-flex gap-2 flex-wrap">
            <span className="badge bg-dark rounded-pill px-3 py-2">
              {notice?.category || "General"}
            </span>

            <span className="badge bg-info text-dark rounded-pill px-3 py-2">
              Audience: {notice?.audience || "All"}
            </span>

            <span
              className={`badge rounded-pill px-3 py-2 ${
                PRIORITY_BADGE[notice?.priority] || "bg-secondary"
              }`}
            >
              {notice?.priority || "Normal"}
            </span>
          </div>
        </div>

        <div className="text-end">
          <small className="text-muted d-block">
            <i className="bi bi-calendar-event me-1"></i>
            {publishDate}
          </small>

          {notice?.isActive ? (
            <span className="badge bg-success rounded-pill px-3 py-2 mt-2">
              Active
            </span>
          ) : (
            <span className="badge bg-secondary rounded-pill px-3 py-2 mt-2">
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* DESC */}
      <p className="text-muted mt-3 mb-3 tn-desc">
        {notice?.description || "No description"}
      </p>

      {/* SMALL INFO */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <small className="text-muted">
          <i className="bi bi-paperclip me-1"></i>
          Attachments: <b>{(notice?.attachement || []).length}</b>
        </small>

        {/* ACTION */}
        <button
          className="btn btn-dark rounded-3 fw-semibold"
          onClick={() => {
            const attachments = notice?.attachement || [];

            Swal.fire({
              title: notice?.title || "Notice",
              html: `
                <div style="text-align:left">

                  <p style="margin:0 0 10px 0; color:#555;">
                    ${notice?.description || ""}
                  </p>

                  ${
                    attachments.length > 0
                      ? `
                        <hr/>
                        <h6 style="margin:0 0 10px 0;">Attachments</h6>

                        ${attachments
                          .map(
                            (f) => `
                              <a 
                                href="${f.fileUrl}?dl=1"
                                target="_blank"
                                rel="noreferrer"
                                style="
                                  display:block;
                                  padding:10px 12px;
                                  margin-bottom:8px;
                                  border:1px solid #eee;
                                  border-radius:12px;
                                  text-decoration:none;
                                  color:#111;
                                  font-weight:600;
                                  background:#f9fafb;
                                "
                              >
                                📎 ${f.fileName}
                                <div style="font-size:12px; color:#777; font-weight:400;">
                                  (${f.fileType || "file"}) Click to download
                                </div>
                              </a>
                            `
                          )
                          .join("")}
                      `
                      : `<p style="color:#777;margin:0;">No attachments</p>`
                  }

                </div>
              `,
              icon: "info",
              confirmButtonText: "Close",
              width: 700,
            });
          }}
        >
          <i className="bi bi-eye me-2"></i>
          View
        </button>
      </div>
    </div>
  </div>
</div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NoticeBoard;