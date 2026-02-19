import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  getMyStudentLeaves,
  studentApplyLeave,
} from "../../services/authService.js";

const LEAVE_TYPES = ["SICK", "CASUAL", "EMERGENCY", "OTHER"];

function LeavePermission() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
  });

  const [formData, setFormData] = useState({
    leaveType: "SICK",
    reason: "",
    fromDate: "",
    toDate: "",
  });

  const [file, setFile] = useState(null);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toISOString().slice(0, 10);
  };

  const statusBadge = (finalStatus) => {
    if (finalStatus === "APPROVED") return "success";
    if (finalStatus === "REJECTED") return "danger";
    return "warning";
  };

  const prettyStatus = (finalStatus) => {
    if (finalStatus === "APPROVED") return "Approved";
    if (finalStatus === "REJECTED") return "Rejected";
    return "Pending";
  };

  const getProgressText = (l) => {
    if (l.finalStatus === "APPROVED") return "Approved";
    if (l.finalStatus === "REJECTED") return "Rejected";

    if (l.teacherStatus === "PENDING") return "Waiting for Teacher";
    if (l.teacherStatus === "FORWARD") return "Forwarded to Admin";
    return "Pending";
  };

  // ===================== SWAL HELPERS =====================
  const toastSuccess = (msg) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: msg,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const popupError = (msg) => {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: msg,
      confirmButtonText: "OK",
    });
  };

  // ===================== FETCH LEAVES =====================
  const fetchLeaves = async () => {
    try {
      setFetching(true);
      const res = await getMyStudentLeaves();
      const list = res?.data || [];
      setLeaves(list);
    } catch (err) {
      console.log(err);
      popupError(err?.response?.data?.message || "Failed to fetch leaves");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ===================== SUBMIT LEAVE =====================
  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.leaveType) return popupError("Leave type is required");
    if (!formData.reason?.trim()) return popupError("Reason is required");
    if (!formData.fromDate) return popupError("From date is required");
    if (!formData.toDate) return popupError("To date is required");

    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      return popupError("From date cannot be greater than To date");
    }

    // optional file validation
    if (file) {
      const allowed = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowed.includes(file.type)) {
        return popupError("Only JPG, PNG, PDF files are allowed");
      }
      if (file.size > 5 * 1024 * 1024) {
        return popupError("File size must be under 5MB");
      }
    }

    const confirm = await Swal.fire({
      icon: "question",
      title: "Submit Leave Request?",
      html: `
        <div style="text-align:left">
          <div><b>Type:</b> ${formData.leaveType}</div>
          <div><b>From:</b> ${formData.fromDate}</div>
          <div><b>To:</b> ${formData.toDate}</div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("leaveType", formData.leaveType);
      fd.append("reason", formData.reason);
      fd.append("fromDate", formData.fromDate);
      fd.append("toDate", formData.toDate);

      if (file) fd.append("attachment", file);

      await studentApplyLeave(fd);

      toastSuccess("Leave applied successfully");

      setFormData({
        leaveType: "SICK",
        reason: "",
        fromDate: "",
        toDate: "",
      });

      setFile(null);
      fetchLeaves();
    } catch (err) {
      console.log(err);
      popupError(err?.response?.data?.message || "Leave apply failed");
    } finally {
      setLoading(false);
    }
  };

  // ===================== FILTERED LIST =====================
  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => {
      const q = filters.search.toLowerCase().trim();

      const matchSearch =
        !q ||
        (l.leaveType || "").toLowerCase().includes(q) ||
        (l.reason || "").toLowerCase().includes(q);

      const matchStatus =
        filters.status === "ALL" ? true : l.finalStatus === filters.status;

      return matchSearch && matchStatus;
    });
  }, [leaves, filters]);

  // ===================== LIGHT THEME STYLES =====================
  const GRADIENT = "linear-gradient(135deg,#0b0f19,#111827)";
  const PAGE_BG = "#f5f7fb";
  const CARD_BG = "#ffffff";
  const SOFT_BG = "#f3f4f6";
  const BORDER = "rgba(0,0,0,0.08)";
  const TEXT_MUTED = "rgba(0,0,0,0.55)";

  return (
    <div className="min-vh-100 " style={{ background: PAGE_BG }}>
      <div className="container" style={{ maxWidth: 1250 }}>
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-3">
  

              <div>
                <h3 className="fw-bold mb-0">Leave Permission</h3>
                <div className="small" style={{ color: TEXT_MUTED }}>
                  Apply leave and track approvals (Teacher → Admin)
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn rounded-4 px-3"
              onClick={fetchLeaves}
              disabled={fetching}
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
              }}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              {fetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* APPLY LEAVE FORM */}
          <div className="col-lg-5">
            <div
              className="card border-0 rounded-4 shadow-sm overflow-hidden"
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div
                className="p-4"
                style={{
                  background: GRADIENT,
                  color: "white",
                }}
              >
                <h5 className="fw-bold mb-1">
                  <i className="bi bi-pencil-square me-2"></i>
                  Apply for Leave
                </h5>
                <div className="small" style={{ opacity: 0.9 }}>
                  Fill the form carefully before submitting.
                </div>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Leave Type</label>
                    <select
                      className="form-select rounded-4"
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleChange}
                      required
                      style={{
                        background: SOFT_BG,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      {LEAVE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Reason</label>
                    <textarea
                      className="form-control rounded-4"
                      rows="4"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Write your reason..."
                      required
                      style={{
                        background: SOFT_BG,
                        border: `1px solid ${BORDER}`,
                      }}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        From Date
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-4"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleChange}
                        required
                        style={{
                          background: SOFT_BG,
                          border: `1px solid ${BORDER}`,
                        }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">To Date</label>
                      <input
                        type="date"
                        className="form-control rounded-4"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleChange}
                        required
                        style={{
                          background: SOFT_BG,
                          border: `1px solid ${BORDER}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* ATTACHMENT */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Attachment (optional)
                    </label>
                    <input
                      type="file"
                      className="form-control rounded-4"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      style={{
                        background: SOFT_BG,
                        border: `1px solid ${BORDER}`,
                      }}
                    />
                    <div className="small mt-1" style={{ color: TEXT_MUTED }}>
                      Allowed: JPG, PNG, PDF (Max 5MB)
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 rounded-4 py-2 fw-semibold"
                    style={{
                      background: GRADIENT,
                      color: "white",
                      border: "none",
                    }}
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

                <div
                  className="mt-3 p-3 rounded-4"
                  style={{
                    background: SOFT_BG,
                    border: `1px solid ${BORDER}`,
                    color: TEXT_MUTED,
                  }}
                >
                  <i className="bi bi-info-circle me-2"></i>
                  Teacher will approve first. If required, teacher will forward it
                  to admin.
                </div>
              </div>
            </div>
          </div>

          {/* LEAVE LIST */}
          <div className="col-lg-7">
            <div
              className="card border-0 shadow-sm rounded-4"
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                  <div>
                    <h5 className="fw-bold mb-1">
                      <i className="bi bi-list-check text-primary me-2"></i>
                      My Leave Requests
                    </h5>
                    <div className="small" style={{ color: TEXT_MUTED }}>
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
                        placeholder="Search by leave type or reason..."
                        value={filters.search}
                        onChange={(e) =>
                          setFilters((p) => ({ ...p, search: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-5">
                    <select
                      className="form-select"
                      value={filters.status}
                      onChange={(e) =>
                        setFilters((p) => ({ ...p, status: e.target.value }))
                      }
                    >
                      <option value="ALL">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
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
                          key={l._id}
                          className="border rounded-4 p-3 bg-white"
                        >
                          <div className="d-flex align-items-start justify-content-between gap-3">
                            <div>
                              <div className="fw-bold d-flex align-items-center gap-2">
                                <span>{l.leaveType}</span>
                                <span className="badge text-bg-light border text-dark rounded-pill">
                                  {l.totalDays || 1} day(s)
                                </span>
                              </div>

                              <div className="text-muted small mt-1">
                                <i className="bi bi-calendar-event me-2"></i>
                                {formatDate(l.fromDate)} → {formatDate(l.toDate)}
                              </div>

                              <div className="text-muted small mt-1">
                                <i className="bi bi-hourglass-split me-2"></i>
                                {getProgressText(l)}
                              </div>
                            </div>

                            <span
                              className={`badge text-bg-${statusBadge(
                                l.finalStatus
                              )} rounded-pill`}
                            >
                              {prettyStatus(l.finalStatus)}
                            </span>
                          </div>

                          <div
                            className="text-muted mt-2"
                            style={{ lineHeight: 1.6 }}
                          >
                            {(l.reason || "").length > 140
                              ? l.reason.slice(0, 140) + "..."
                              : l.reason}
                          </div>

                          <div className="d-flex justify-content-end mt-3">
                            <button
                              className="btn btn-outline-primary btn-sm rounded-3"
                              onClick={() => setSelectedLeave(l)}
                            >
                              View <i className="bi bi-eye ms-1"></i>
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
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {selectedLeave.leaveType} Leave
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
                      selectedLeave.finalStatus
                    )} rounded-pill`}
                  >
                    {prettyStatus(selectedLeave.finalStatus)}
                  </span>

                  <span className="badge text-bg-light border text-dark rounded-pill">
                    Teacher: {selectedLeave.teacherStatus}
                  </span>

                  <span className="badge text-bg-light border text-dark rounded-pill">
                    Admin: {selectedLeave.adminStatus}
                  </span>
                </div>

                <div className="p-3 bg-light rounded-4">
                  <div className="fw-semibold mb-1">Reason</div>
                  <div className="text-muted" style={{ lineHeight: 1.7 }}>
                    {selectedLeave.reason}
                  </div>
                </div>

                <div className="mt-3 p-3 border rounded-4">
                  <div className="fw-semibold mb-2">
                    <i className="bi bi-reply-fill me-2"></i>
                    Teacher Remark
                  </div>

                  <div className="text-muted" style={{ lineHeight: 1.7 }}>
                    {selectedLeave.teacherRemark || "Not given"}
                  </div>
                </div>

                {selectedLeave.attachment ? (
                  <div className="mt-3">
                    <a
                      href={selectedLeave.attachment}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-secondary rounded-4"
                    >
                      <i className="bi bi-paperclip me-2"></i>
                      View Attachment
                    </a>
                  </div>
                ) : null}
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