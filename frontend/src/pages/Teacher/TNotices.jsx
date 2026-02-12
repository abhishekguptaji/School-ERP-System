import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./css/TeacherNotice.css";

import { getTeacherNotices } from "../../services/authService.js"; 

function TNotices() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await getTeacherNotices();

      // response format: { success:true, data:[...] }
      setData(res?.data || []);
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to fetch teacher notices",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filtered = useMemo(() => {
    let list = [...(data || [])];

    if (priority !== "all") {
      list = list.filter((n) => n?.priority === priority);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((n) => {
        return (
          n?.title?.toLowerCase().includes(s) ||
          n?.category?.toLowerCase().includes(s) ||
          n?.description?.toLowerCase().includes(s)
        );
      });
    }

    // newest first
    list.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
    return list;
  }, [data, search, priority]);

  const badgeClass = (p) => {
    if (p === "Urgent") return "badge bg-danger";
    if (p === "Important") return "badge bg-warning text-dark";
    return "badge bg-info text-dark";
  };

  const getAttachmentIcon = (fileType) => {
    if (fileType === "pdf") return "bi bi-file-earmark-pdf";
    if (fileType === "image") return "bi bi-image";
    return "bi bi-paperclip";
  };

  return (
    <div className="container-fluid mt-4">
      <div className="tn-card">
        {/* HEADER */}
        <div className="tn-header">
          <div>
            <h4 className="mb-0 fw-bold text-primary">Teacher Notices</h4>
            <p className="mb-0 text-muted small">
              Notices assigned for teacher audience
            </p>
          </div>

          <button
            className="btn btn-sm btn-outline-primary rounded-3"
            onClick={fetchNotices}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>

        {/* FILTERS */}
        <div className="tn-filters">
          <input
            className="form-control form-control-sm rounded-3"
            placeholder="Search by title / category / description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-select form-select-sm rounded-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="Low">Low</option>
            <option value="Important">Important</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* BODY */}
        <div className="tn-body">
          {loading ? (
            <div className="p-3 text-muted">Loading notices...</div>
          ) : filtered.length === 0 ? (
            <div className="p-3 text-muted">No notices found.</div>
          ) : (
            <div className="row g-3">
              {filtered.map((n) => (
                <div className="col-12 col-md-6 col-xl-4" key={n._id}>
                  <div className="tn-notice">
                    {/* top */}
                    <div className="tn-top">
                      <div className="tn-title">{n?.title}</div>
                      <span className={badgeClass(n?.priority)}>
                        {n?.priority}
                      </span>
                    </div>

                    <div className="tn-meta">
                      <span>
                        <i className="bi bi-tag me-2"></i>
                        {n?.category}
                      </span>
                      <span>
                        <i className="bi bi-people me-2"></i>
                        {n?.audience}
                      </span>
                    </div>

                    <div className="tn-desc">{n?.description}</div>

                    <div className="tn-dates">
                      <span>
                        <i className="bi bi-calendar-event me-2"></i>
                        Publish:{" "}
                        {n?.publishAt
                          ? new Date(n.publishAt).toLocaleDateString()
                          : "-"}
                      </span>

                      <span>
                        <i className="bi bi-calendar-x me-2"></i>
                        Expire:{" "}
                        {n?.expireAt
                          ? new Date(n.expireAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>

                    {/* bottom */}
                    <div className="tn-bottom">
                      {n?.attachement?.[0]?.fileUrl ? (
                        <a
                          href={n.attachement[0].fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary rounded-3"
                        >
                          <i
                            className={`${getAttachmentIcon(
                              n.attachement[0]?.fileType
                            )} me-2`}
                          ></i>
                          View {n.attachement[0]?.fileType || "Attachment"}
                        </a>
                      ) : (
                        <span className="text-muted small">No attachment</span>
                      )}

                      <span className="tn-createdAt">
                        {n?.createdAt
                          ? new Date(n.createdAt).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TNotices;
