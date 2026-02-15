import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { getStudentNotices } from "../../services/authService.js";
import "./css/NoticeBoard.css";

const PRIORITY_META = {
  Normal: { badge: "secondary", icon: "bi-dot" },
  Important: { badge: "warning", icon: "bi-exclamation-circle" },
  Urgent: { badge: "danger", icon: "bi-exclamation-triangle" },
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

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="nb-page">
        <div className="container-fluid nb-container">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div className="spinner-border text-primary"></div>
              <div className="fw-semibold">Loading notices...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="nb-page">
        <div className="container-fluid nb-container">
          <div className="nb-errorCard">
            <div className="nb-errorIcon">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>

            <h4 className="fw-bold mb-1">Failed to load notices</h4>
            <p className="text-muted mb-3">{error}</p>

            <button className="nb-retryBtn" onClick={fetchNotices}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="nb-page">
      <div className="container-fluid nb-container">
        {/* HEADER */}
        <div className="nb-header mb-4">
          <div>
            <h3 className="nb-title">
              Notice Board
            </h3>
          </div>

          <button className="nb-refreshBtn" onClick={fetchNotices}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>

        {/* SEARCH */}
        <div className="card border-0 shadow-sm rounded-4 mb-3">
          <div className="card-body p-3">
            <div className="nb-search">
              <i className="bi bi-search"></i>
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search by title, category, priority, audience..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search.trim() && (
                <button
                  className="nb-clearBtn"
                  type="button"
                  onClick={() => setSearch("")}
                  title="Clear"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* COUNT */}
        <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
          <small className="text-muted">
            Showing <b>{filteredNotices.length}</b> of <b>{notices.length}</b>
          </small>

          <span className="nb-countBadge">
            <i className="bi bi-list-ul me-2"></i>
            Total Notices: <b>{notices.length}</b>
          </span>
        </div>

        {/* LIST */}
        {filteredNotices.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 text-center">
              <div className="nb-emptyIcon">
                <i className="bi bi-inboxes-fill"></i>
              </div>
              <h5 className="fw-bold mb-1">No notices found</h5>
              <p className="text-muted mb-0">
                Try searching with different keywords.
              </p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredNotices.map((notice) => {
              const attachments = notice?.attachement || [];
              const publishDate = notice?.publishAt
                ? new Date(notice.publishAt).toLocaleDateString()
                : "N/A";

              const priority = notice?.priority || "Normal";
              const priorityMeta = PRIORITY_META[priority] || PRIORITY_META.Normal;

              return (
                <div className="col-12 col-md-6" key={notice._id}>
                  <div className="nb-card">
                    {/* TOP */}
                    <div className="nb-cardTop">
                      <div className="nb-cardTitleWrap">
                        <h5 className="nb-cardTitle">
                          {notice?.title || "-"}
                        </h5>

                        <div className="nb-tags">
                          <span className="nb-tag dark">
                            {notice?.category || "General"}
                          </span>

                          <span className="nb-tag info">
                            Audience: {notice?.audience || "All"}
                          </span>

                          <span
                            className={`nb-tag priority text-bg-${priorityMeta.badge}`}
                          >
                            <i className={`bi ${priorityMeta.icon} me-1`}></i>
                            {priority}
                          </span>
                        </div>
                      </div>

                      <div className="nb-rightMeta">
                        <div className="nb-date">
                          <i className="bi bi-calendar-event me-1"></i>
                          {publishDate}
                        </div>

                        {notice?.isActive ? (
                          <span className="nb-activeBadge">
                            <i className="bi bi-check-circle me-1"></i> Active
                          </span>
                        ) : (
                          <span className="nb-inactiveBadge">
                            <i className="bi bi-slash-circle me-1"></i> Inactive
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DESC */}
                    <p className="nb-desc">
                      {notice?.description || "No description"}
                    </p>

                    {/* FOOTER */}
                    <div className="nb-cardFooter">
                      <div className="nb-attachInfo">
                        <i className="bi bi-paperclip me-2"></i>
                        Attachments: <b>{attachments.length}</b>
                      </div>

                      <button
                        className="nb-viewBtn"
                        onClick={() => {
                          Swal.fire({
                            title: notice?.title || "Notice",
                            html: `
                              <div style="text-align:left">

                                <p style="margin:0 0 12px 0; color:#334155; font-weight:600;">
                                  ${notice?.description || ""}
                                </p>

                                ${
                                  attachments.length > 0
                                    ? `
                                      <hr/>
                                      <h6 style="margin:0 0 10px 0; font-weight:800;">Attachments</h6>

                                      ${attachments
                                        .map(
                                          (f) => `
                                            <a 
                                              href="${f.fileUrl}?dl=1"
                                              target="_blank"
                                              rel="noreferrer"
                                              style="
                                                display:block;
                                                padding:12px 14px;
                                                margin-bottom:10px;
                                                border:1px solid rgba(15,23,42,0.08);
                                                border-radius:14px;
                                                text-decoration:none;
                                                color:#0f172a;
                                                font-weight:800;
                                                background:#f8fafc;
                                              "
                                            >
                                              📎 ${f.fileName}
                                              <div style="font-size:12px; color:#64748b; font-weight:600;">
                                                (${f.fileType || "file"}) Click to download
                                              </div>
                                            </a>
                                          `
                                        )
                                        .join("")}
                                    `
                                    : `<p style="color:#64748b;margin:0;font-weight:600;">No attachments</p>`
                                }

                              </div>
                            `,
                            icon: "info",
                            confirmButtonText: "Close",
                            width: 750,
                          });
                        }}
                      >
                        <i className="bi bi-eye me-2"></i>
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ height: 10 }}></div>
      </div>
    </div>
  );
}

export default NoticeBoard;