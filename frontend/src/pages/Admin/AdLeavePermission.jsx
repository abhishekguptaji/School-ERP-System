import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  adminGetForwardedLeaves,
  adminActionOnLeave,
} from "../../services/adminService.js";

function AdLeavePermission() {
  const [leaves, setLeaves] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [search, setSearch] = useState("");

  // ================= FETCH =================
  const fetchLeaves = async () => {
    try {
      setFetching(true);
      const res = await adminGetForwardedLeaves();
      setLeaves(res?.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load leaves", "error");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ================= FILTER =================
  const filteredLeaves = useMemo(() => {
    const q = search.toLowerCase();
    return leaves.filter((l) =>
      l?.studentId?.name?.toLowerCase().includes(q) ||
      l?.studentId?.admissionNo?.toLowerCase().includes(q) ||
      l?.reason?.toLowerCase().includes(q)
    );
  }, [leaves, search]);

  // ================= ACTION =================
  const handleAction = async (leaveId, action) => {
    const { value, isConfirmed } = await Swal.fire({
      title: `${action} Leave`,
      input: "textarea",
      inputPlaceholder: "Write remark...",
      showCancelButton: true,
      confirmButtonText: action,
    });

    if (!isConfirmed) return;

    try {
      await adminActionOnLeave(leaveId, {
        action,
        adminRemark: value || "",
      });

      Swal.fire("Success", `Leave ${action}d`, "success");
      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      Swal.fire("Error", "Action failed", "error");
    }
  };

  // ================= STATS =================
  const total = leaves.length;
  const today = leaves.filter(
    (l) =>
      new Date(l.createdAt).toDateString() ===
      new Date().toDateString()
  ).length;

  return (
    <div style={{ background: "#eef1f7", minHeight: "100vh" }}>
      <div className="container py-4" style={{ maxWidth: 1300 }}>

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold">
              <i className="bi bi-shield-check me-2"></i>
              Admin Leave Management
            </h3>
            <div className="text-muted small">
              Review forwarded leave requests
            </div>
          </div>

          <button
            className="btn btn-dark rounded-3"
            onClick={fetchLeaves}
            disabled={fetching}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="row g-3 mb-4">
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Total Forwarded</div>
              <div className="fs-4 fw-bold">{total}</div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Today</div>
              <div className="fs-4 fw-bold">{today}</div>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, admission no, reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* LIST */}
        {filteredLeaves.length === 0 ? (
          <div className="alert alert-info rounded-4">
            No forwarded leaves found.
          </div>
        ) : (
          <div className="row g-3">
            {filteredLeaves.map((l) => (
              <div className="col-lg-6" key={l._id}>
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="fw-bold">
                        {l.studentId?.user}{" "} 
                        <span className="text-muted">
                          ({l.studentId?.admissionNo})
                        </span>
                      </div>
                      <div className="small text-muted">
                        {l.studentId?.className} 
                      </div>
                    </div>

                    <span className="badge bg-primary rounded-pill">
                      Forwarded
                    </span>
                  </div>

                  <div className="mt-3 small text-muted">
                    <i className="bi bi-calendar-event me-1"></i>
                    {new Date(l.fromDate).toLocaleDateString()} →{" "}
                    {new Date(l.toDate).toLocaleDateString()}
                  </div>

                  <div className="mt-2">
                    {(l.reason || "").slice(0, 120)}
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-outline-dark btn-sm rounded-3"
                      onClick={() => setSelectedLeave(l)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-success btn-sm rounded-3"
                      onClick={() => handleAction(l._id, "APPROVE")}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm rounded-3"
                      onClick={() => handleAction(l._id, "REJECT")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedLeave && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedLeave.studentId?.name} - Leave Details
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedLeave(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p><b>Reason:</b> {selectedLeave.reason}</p>
                <p>
                  <b>Dates:</b>{" "}
                  {new Date(selectedLeave.fromDate).toLocaleDateString()} →{" "}
                  {new Date(selectedLeave.toDate).toLocaleDateString()}
                </p>
                <p>
                  <b>Teacher Remark:</b>{" "}
                  {selectedLeave.teacherRemark || "Not Given"}
                </p>

                {selectedLeave.attachment && (
                  <a
                    href={selectedLeave.attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="bi bi-paperclip me-1"></i>
                    View Attachment
                  </a>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
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

export default AdLeavePermission;