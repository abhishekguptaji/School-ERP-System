import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  getTeacherPendingLeaves,
  teacherActionOnLeave,
} from "../../services/teacherService.js";

function TLeave() {
  const [fetching, setFetching] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
  });

  // ===================== HELPERS =====================
  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toISOString().slice(0, 10);
  };

  const toastSuccess = (msg) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: msg,
      showConfirmButton: false,
      timer: 1800,
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

  // ===================== FETCH =====================
  const fetchLeaves = async () => {
    try {
      setFetching(true);
      const res = await getTeacherPendingLeaves();
      setLeaves(res?.data || []);
    } catch (err) {
      console.log(err);
      popupError(err?.response?.data?.message || "Failed to fetch pending leaves");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ===================== FILTER =====================
  const filteredLeaves = useMemo(() => {
    const q = filters.search.toLowerCase().trim();

    return leaves.filter((l) => {
      if (!q) return true;

      const studentName = (l?.studentId?.name || "").toLowerCase();
      const admissionNo = (l?.studentId?.admissionNo || "").toLowerCase();
      const reason = (l?.reason || "").toLowerCase();
      const leaveType = (l?.leaveType || "").toLowerCase();

      return (
        studentName.includes(q) ||
        admissionNo.includes(q) ||
        reason.includes(q) ||
        leaveType.includes(q)
      );
    });
  }, [leaves, filters]);

  // ===================== ACTIONS =====================
  const doTeacherAction = async (leaveId, action) => {
    if (actionLoading) return;

    try {
      setActionLoading(true);

      if (action === "APPROVE") {
        const confirm = await Swal.fire({
          icon: "question",
          title: "Approve Leave?",
          text: "This will approve the leave request.",
          showCancelButton: true,
          confirmButtonText: "Yes, Approve",
          cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        await teacherActionOnLeave(leaveId, {
          action: "APPROVE",
          teacherRemark: "",
        });

        toastSuccess("Leave approved");
      }

      if (action === "REJECT") {
        const { value, isConfirmed } = await Swal.fire({
          icon: "warning",
          title: "Reject Leave",
          input: "textarea",
          inputLabel: "Teacher Remark (required)",
          inputPlaceholder: "Write reason for rejection...",
          showCancelButton: true,
          confirmButtonText: "Reject",
          cancelButtonText: "Cancel",
          inputValidator: (val) => {
            if (!val || !val.trim()) return "Remark is required";
          },
        });

        if (!isConfirmed) return;

        await teacherActionOnLeave(leaveId, {
          action: "REJECT",
          teacherRemark: value,
        });

        toastSuccess("Leave rejected");
      }

      if (action === "FORWARD") {
        const { value, isConfirmed } = await Swal.fire({
          icon: "info",
          title: "Forward to Admin?",
          input: "textarea",
          inputLabel: "Remark (optional)",
          inputPlaceholder: "Write why you are forwarding to admin...",
          showCancelButton: true,
          confirmButtonText: "Forward",
          cancelButtonText: "Cancel",
        });

        if (!isConfirmed) return;

        await teacherActionOnLeave(leaveId, {
          action: "FORWARD",
          teacherRemark: value || "",
        });

        toastSuccess("Leave forwarded to admin");
      }

      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      console.log(err);
      popupError(err?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  // ===================== STYLES =====================
  const PAGE_BG = "#f5f7fb";
  const CARD_BG = "#ffffff";
  const SOFT_BG = "#f3f4f6";
  const BORDER = "rgba(0,0,0,0.08)";
  const TEXT_MUTED = "rgba(0,0,0,0.55)";
  const GRADIENT = "linear-gradient(135deg,#0b0f19,#111827)";

  return (
    <div className="min-vh-100 py-4" style={{ background: PAGE_BG }}>
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-4 d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: 50,
                height: 50,
                background: GRADIENT,
                color: "white",
              }}
            >
              <i className="bi bi-person-check-fill fs-5"></i>
            </div>

            <div>
              <h3 className="fw-bold mb-0">Teacher Leave Panel</h3>
              <div className="small" style={{ color: TEXT_MUTED }}>
                Approve, reject or forward student leave requests
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

        {/* MAIN */}
        <div
          className="card border-0 shadow-sm rounded-4"
          style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
        >
          <div className="card-body p-4">
            {/* Search */}
            <div className="row g-3 align-items-center">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by student name, admission no, reason, leave type..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, search: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="col-md-4 text-md-end">
                <div className="small" style={{ color: TEXT_MUTED }}>
                  Pending Requests:{" "}
                  <b className="text-dark">{filteredLeaves.length}</b>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="mt-4">
              {filteredLeaves.length === 0 ? (
                <div className="alert alert-info rounded-4 border mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  No pending leave requests.
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {filteredLeaves.map((l) => (
                    <div
                      key={l._id}
                      className="rounded-4 p-3"
                      style={{
                        background: SOFT_BG,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      <div className="d-flex align-items-start justify-content-between gap-3">
                        <div>
                          <div className="fw-bold">
                            {l?.studentId?.name || "Student"}{" "}
                            <span className="text-muted fw-normal">
                              ({l?.studentId?.admissionNo || "N/A"})
                            </span>
                          </div>

                          <div className="text-muted small mt-1">
                            <i className="bi bi-calendar-event me-2"></i>
                            {formatDate(l.fromDate)} → {formatDate(l.toDate)}
                            <span className="ms-2 badge text-bg-light border text-dark rounded-pill">
                              {l.totalDays || 1} day(s)
                            </span>
                          </div>

                          <div className="text-muted small mt-1">
                            <i className="bi bi-tag-fill me-2"></i>
                            {l.leaveType}
                          </div>
                        </div>

                        <div className="d-flex gap-2 flex-wrap justify-content-end">
                          <button
                            className="btn btn-outline-dark btn-sm rounded-4 px-3"
                            onClick={() => setSelectedLeave(l)}
                          >
                            View <i className="bi bi-eye ms-1"></i>
                          </button>

                          <button
                            className="btn btn-success btn-sm rounded-4 px-3"
                            disabled={actionLoading}
                            onClick={() => doTeacherAction(l._id, "APPROVE")}
                          >
                            <i className="bi bi-check2-circle me-1"></i>
                            Approve
                          </button>

                          <button
                            className="btn btn-danger btn-sm rounded-4 px-3"
                            disabled={actionLoading}
                            onClick={() => doTeacherAction(l._id, "REJECT")}
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Reject
                          </button>

                          <button
                            className="btn btn-primary btn-sm rounded-4 px-3"
                            disabled={actionLoading}
                            onClick={() => doTeacherAction(l._id, "FORWARD")}
                          >
                            <i className="bi bi-send me-1"></i>
                            Forward
                          </button>
                        </div>
                      </div>

                      <div
                        className="mt-2 text-muted"
                        style={{ lineHeight: 1.6 }}
                      >
                        {(l.reason || "").length > 180
                          ? l.reason.slice(0, 180) + "..."
                          : l.reason}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  {selectedLeave?.studentId?.name || "Student"} -{" "}
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

                  <span className="badge text-bg-warning rounded-pill">
                    Pending
                  </span>

                  <span className="badge text-bg-light border text-dark rounded-pill">
                    Days: {selectedLeave.totalDays || 1}
                  </span>
                </div>

                <div className="p-3 bg-light rounded-4">
                  <div className="fw-semibold mb-1">Reason</div>
                  <div className="text-muted" style={{ lineHeight: 1.7 }}>
                    {selectedLeave.reason}
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
                ) : (
                  <div className="small mt-3 text-muted">
                    No attachment uploaded.
                  </div>
                )}
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary rounded-4"
                  onClick={() => setSelectedLeave(null)}
                >
                  Close
                </button>

                <button
                  className="btn btn-success rounded-4"
                  disabled={actionLoading}
                  onClick={() => doTeacherAction(selectedLeave._id, "APPROVE")}
                >
                  Approve
                </button>

                <button
                  className="btn btn-danger rounded-4"
                  disabled={actionLoading}
                  onClick={() => doTeacherAction(selectedLeave._id, "REJECT")}
                >
                  Reject
                </button>

                <button
                  className="btn btn-primary rounded-4"
                  disabled={actionLoading}
                  onClick={() => doTeacherAction(selectedLeave._id, "FORWARD")}
                >
                  Forward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TLeave;