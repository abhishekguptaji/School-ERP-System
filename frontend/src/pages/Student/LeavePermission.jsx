
import { useEffect, useMemo, useState } from "react";
// import { applyLeave, getMyLeaves } from "../api/leave.api";

function LeavePermission() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const [formData, setFormData] = useState({
    title: "",
    reason: "",
    fromDate: "",
    toDate: "",
  });

  // ===================== UI HELPERS =====================
  const statusBadge = (status) => {
    if (status === "Approved") return "success";
    if (status === "Rejected") return "danger";
    return "warning"; // Pending
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toISOString().slice(0, 10);
  };

  // ===================== FETCH LEAVES =====================
  const fetchLeaves = async () => {
    try {
      setFetching(true);
      const res = await getMyLeaves();

      // Expected format:
      // res.data = [{...}, {...}]
      // but if your backend returns directly array, handle both:
      const list = res?.data || res || [];
      setLeaves(list);
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to fetch leaves");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ===================== SUBMIT LEAVE =====================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // small validation
    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      alert("From date cannot be greater than To date");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        reason: formData.reason,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
      };

      await applyLeave(payload);

      alert("Leave applied successfully");

      setFormData({
        title: "",
        reason: "",
        fromDate: "",
        toDate: "",
      });

      // refresh list
      fetchLeaves();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Leave apply failed");
    } finally {
      setLoading(false);
    }
  };

  // ===================== FILTERED LIST =====================
  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => {
      const title = (l.title || "").toLowerCase();
      const reason = (l.reason || "").toLowerCase();
      const q = filters.search.toLowerCase();

      const matchSearch = title.includes(q) || reason.includes(q);

      const matchStatus =
        filters.status === "All" ? true : l.status === filters.status;

      return matchSearch && matchStatus;
    });
  }, [leaves, filters]);

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              <i className="bi bi-calendar2-check-fill text-primary me-2"></i>
              Leave Application
            </h3>
            <div className="text-muted">
              Apply leave and track approval status
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary rounded-3"
              onClick={fetchLeaves}
              disabled={fetching}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              {fetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* APPLY LEAVE FORM */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-pencil-square text-primary me-2"></i>
                  Apply for Leave
                </h5>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Fever / Family Function"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Reason</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Write your reason..."
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        From Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">To Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-3 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill me-2"></i>
                        Submit Leave Request
                      </>
                    )}
                  </button>
                </form>

                <div className="alert alert-light border rounded-3 small mt-3 mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Your leave request will be reviewed by the teacher/admin.
                </div>
              </div>
            </div>
          </div>

          {/* LEAVE LIST */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                  <div>
                    <h5 className="fw-bold mb-1">
                      <i className="bi bi-list-check text-primary me-2"></i>
                      My Leave Requests
                    </h5>
                    <div className="text-muted small">
                      Total: <b>{leaves.length}</b> | Showing:{" "}
                      <b>{filteredLeaves.length}</b>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="row g-3 mt-3">
                  <div className="col-md-7">
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title or reason..."
                        value={filters.search}
                        onChange={(e) =>
                          setFilters({ ...filters, search: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-5">
                    <select
                      className="form-select"
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* List */}
                <div className="mt-4">
                  {filteredLeaves.length === 0 ? (
                    <div className="alert alert-info rounded-4 border mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      No leave requests found.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {filteredLeaves.map((l) => (
                        <div
                          key={l._id || l.id}
                          className="border rounded-4 p-3 bg-white"
                        >
                          <div className="d-flex align-items-start justify-content-between gap-3">
                            <div>
                              <div className="fw-bold">{l.title}</div>
                              <div className="text-muted small mt-1">
                                <i className="bi bi-calendar-event me-2"></i>
                                {formatDate(l.fromDate)} → {formatDate(l.toDate)}
                              </div>
                            </div>

                            <span
                              className={`badge text-bg-${statusBadge(
                                l.status || "Pending"
                              )} rounded-pill`}
                            >
                              {l.status || "Pending"}
                            </span>
                          </div>

                          <div
                            className="text-muted mt-2"
                            style={{ lineHeight: 1.6 }}
                          >
                            {(l.reason || "").length > 120
                              ? l.reason.slice(0, 120) + "..."
                              : l.reason}
                          </div>

                          <div className="d-flex justify-content-end mt-3">
                            <button
                              className="btn btn-outline-primary btn-sm rounded-3"
                              onClick={() => setSelectedLeave(l)}
                            >
                              View Details <i className="bi bi-eye ms-1"></i>
                            </button>
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

      {/* DETAILS MODAL */}
      {selectedLeave && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {selectedLeave.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedLeave(null)}
                ></button>
              </div>

              <div className="modal-body pt-2">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge text-bg-light border text-dark rounded-pill">
                    <i className="bi bi-calendar-event me-1"></i>
                    {formatDate(selectedLeave.fromDate)} →{" "}
                    {formatDate(selectedLeave.toDate)}
                  </span>

                  <span
                    className={`badge text-bg-${statusBadge(
                      selectedLeave.status || "Pending"
                    )} rounded-pill`}
                  >
                    {selectedLeave.status || "Pending"}
                  </span>
                </div>

                <div className="p-3 bg-light rounded-4">
                  <div className="fw-semibold mb-1">Reason</div>
                  <div className="text-muted" style={{ lineHeight: 1.7 }}>
                    {selectedLeave.reason}
                  </div>
                </div>

                {/* Admin response */}
                <div className="mt-3 p-3 border rounded-4">
                  <div className="fw-semibold mb-1">
                    <i className="bi bi-reply-fill me-2"></i>
                    Response
                  </div>

                  {selectedLeave.response ? (
                    <div className="text-muted" style={{ lineHeight: 1.7 }}>
                      {selectedLeave.response}
                    </div>
                  ) : (
                    <div className="text-muted">
                      No response yet. Please wait for approval.
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary rounded-3"
                  onClick={() => setSelectedLeave(null)}
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

export default LeavePermission;