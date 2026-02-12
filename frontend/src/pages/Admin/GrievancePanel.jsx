import "./css/GrievancePanel.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getAllGrievancesByAdmin,
  getAllTeachersForAssign,
  replyToGrievanceByAdmin,
  updateGrievanceStatus,
  assignTeacherToGrievance,
} from "../../services/adminService.js";

function GrievancePanel() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [grievances, setGrievances] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");

  // modal
  const [active, setActive] = useState(null);
  const [replyMsg, setReplyMsg] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const fetchTeachers = async () => {
  try {
    const res = await getAllTeachersForAssign();
    setTeachers(res?.data || []);
  } catch (error) {
    Swal.fire("Error", error?.response?.data?.message || "Failed", "error");
  }
};

const fetchGrievances = async (page = 1) => {
  try {
    setLoading(true);

    const params = {
      page,
      limit: pagination.limit,
      search,
      status,
      priority,
      category,
    };

    const res = await getAllGrievancesByAdmin(params);

    setGrievances(res?.data?.grievances || []);
    setPagination(res?.data?.pagination || pagination);
  } catch (error) {
    Swal.fire("Error", error?.response?.data?.message || "Failed", "error");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchGrievances(1);
    fetchTeachers();
  }, []);

  const openDetails = (g) => {
    setActive(g);
    setReplyMsg("");
    setNewStatus(g?.status || "");
    setRemarks(g?.remarks || "");
    setSelectedTeacher(g?.assignedTo?._id || "");
  };

  const closeDetails = () => {
    setActive(null);
    setReplyMsg("");
    setNewStatus("");
    setRemarks("");
    setSelectedTeacher("");
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchGrievances(1);
  };

const handleReply = async () => {
  try {
    setSubmitting(true);

    const res = await replyToGrievanceByAdmin(active._id, {
      message: replyMsg,
    });

    setActive(res?.data);
    fetchGrievances(pagination.page);

    Swal.fire("Success", "Reply sent", "success");
  } catch (error) {
    Swal.fire("Error", error?.response?.data?.message || "Failed", "error");
  } finally {
    setSubmitting(false);
  }
};


const handleUpdateStatus = async () => {
  try {
    setSubmitting(true);

    const res = await updateGrievanceStatus(active._id, {
      status: newStatus,
      remarks,
    });

    setActive(res?.data);
    fetchGrievances(pagination.page);

    Swal.fire("Success", "Status updated", "success");
  } catch (error) {
    Swal.fire("Error", error?.response?.data?.message || "Failed", "error");
  } finally {
    setSubmitting(false);
  }
};


const handleAssignTeacher = async () => {
  try {
    setSubmitting(true);

    const res = await assignTeacherToGrievance(active._id, {
      teacherId: selectedTeacher,
    });

    setActive(res?.data);
    fetchGrievances(pagination.page);

    Swal.fire("Success", "Teacher assigned", "success");
  } catch (error) {
    Swal.fire("Error", error?.response?.data?.message || "Failed", "error");
  } finally {
    setSubmitting(false);
  }
};


  const statusBadge = (s) => {
    if (s === "pending") return "badge bg-warning text-dark";
    if (s === "in_progress") return "badge bg-info text-dark";
    if (s === "resolved") return "badge bg-success";
    if (s === "rejected") return "badge bg-danger";
    if (s === "closed") return "badge bg-secondary";
    return "badge bg-dark";
  };

  const priorityBadge = (p) => {
    if (p === "high") return "badge bg-danger";
    if (p === "medium") return "badge bg-warning text-dark";
    if (p === "low") return "badge bg-success";
    return "badge bg-dark";
  };

  const getAttachmentView = () => {
    if (!active?.attachment?.fileUrl) {
      return <div className="text-muted">No attachment</div>;
    }

    const url = active.attachment.fileUrl;
    const type = active.attachment.fileType;

    if (type === "image") {
      return (
        <a href={url} target="_blank" rel="noreferrer">
          <img
            src={url}
            className="img-fluid grievanceAttachment"
            alt="attachment"
          />
        </a>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="btn btn-outline-primary btn-sm"
      >
        <i className="bi bi-file-earmark-text me-2"></i>
        Open Attachment
      </a>
    );
  };

  return (
    <div className="container-fluid  adminGrievanceWrap">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h3 className="mb-0 fw-bold text-primary">Grievance Panel</h3>
          
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => fetchGrievances(1)}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* FILTERS */}
      <div className="card shadow-sm border-0 grievanceFilters mb-3">
        <div className="card-body">
          <form onSubmit={handleApplyFilters} className="row g-2 align-items-end">
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-semibold">Search</label>
              <input
                className="form-control"
                placeholder="Ticket ID / Title / Description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label fw-semibold">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label fw-semibold">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label fw-semibold">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All</option>
                <option value="fees">Fees</option>
                <option value="exam">Exam</option>
                <option value="teacher">Teacher</option>
                <option value="bullying">Bullying</option>
                <option value="transport">Transport</option>
                <option value="library">Library</option>
                <option value="facility">Facility</option>
                <option value="technical">Technical</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-12 d-grid">
              <button className="btn btn-primary">
                <i className="bi bi-search me-2"></i>
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="text-muted mt-2 mb-0">Loading grievances...</p>
            </div>
          ) : grievances.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted"></i>
              <p className="text-muted mt-2 mb-0">No grievances found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle table-hover grievanceTable">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Title</th>
                    <th>Created By</th>
                    <th>Assigned</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {grievances.map((g) => (
                    <tr key={g._id}>
                      <td className="fw-semibold text-primary">{g.ticketId}</td>

                      <td>
                        <div className="fw-semibold">{g.title}</div>
                        <div
                          className="small text-muted text-truncate"
                          style={{ maxWidth: 320 }}
                        >
                          {g.description}
                        </div>
                      </td>

                      <td>
                        <div className="fw-semibold">
                          {g?.createdBy?.fullName || "N/A"}
                        </div>
                        <div className="small text-muted">
                          {g?.createdBy?.email || ""}
                        </div>
                        <div className="small text-muted">
                          Role:{" "}
                          <span className="fw-semibold">{g.createdByRole}</span>
                        </div>
                      </td>

                      <td>
                        {g?.assignedTo?.fullName ? (
                          <>
                            <div className="fw-semibold">
                              {g.assignedTo.fullName}
                            </div>
                            <div className="small text-muted">
                              {g.assignedTo.email}
                            </div>
                          </>
                        ) : (
                          <span className="text-muted">Not assigned</span>
                        )}
                      </td>

                      <td className="text-capitalize">{g.category}</td>

                      <td>
                        <span className={priorityBadge(g.priority)}>
                          {g.priority}
                        </span>
                      </td>

                      <td>
                        <span className={statusBadge(g.status)}>
                          {g.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="text-muted small">
                        {new Date(g.createdAt).toLocaleString()}
                      </td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openDetails(g)}
                        >
                          <i className="bi bi-eye me-1"></i>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && grievances.length > 0 && (
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
              <div className="text-muted small">
                Showing page <b>{pagination.page}</b> of{" "}
                <b>{pagination.totalPages}</b> | Total <b>{pagination.total}</b>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchGrievances(pagination.page - 1)}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>

                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchGrievances(pagination.page + 1)}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAILS MODAL */}
      {active && (
        <div className="grievanceModalBackdrop">
          <div className="grievanceModal card shadow-lg border-0">
            <div className="card-body">
              {/* HEADER */}
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <h5 className="mb-1 fw-bold text-primary">
                    {active.ticketId} — {active.title}
                  </h5>
                  <div className="text-muted small">
                    Created: {new Date(active.createdAt).toLocaleString()}
                  </div>

                  {active?.resolvedAt && (
                    <div className="text-muted small">
                      Resolved: {new Date(active.resolvedAt).toLocaleString()}
                    </div>
                  )}
                </div>

                <button className="btn btn-sm btn-light" onClick={closeDetails}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <hr />

              <div className="row g-3">
                {/* LEFT */}
                <div className="col-lg-8">
                  <div className="grievanceBlock">
                    <div className="fw-bold mb-1">Description</div>
                    <div className="text-muted">{active.description}</div>
                  </div>

                  <div className="grievanceBlock mt-3">
                    <div className="fw-bold mb-2">Attachment</div>
                    {getAttachmentView()}
                  </div>

                  <div className="grievanceBlock mt-4">
                    <div className="fw-bold mb-2">
                      Replies ({active?.replies?.length || 0})
                    </div>

                    {active?.replies?.length === 0 ? (
                      <div className="text-muted">No replies yet</div>
                    ) : (
                      <div className="replyList">
                        {active.replies.map((r, idx) => (
                          <div key={idx} className={`replyItem ${r.senderRole}`}>
                            <div className="d-flex justify-content-between align-items-center gap-2">
                              <div className="fw-semibold">
                                {r?.sender?.fullName || "Unknown"}{" "}
                                <span className="text-muted small">
                                  ({r.senderRole})
                                </span>
                              </div>
                              <div className="text-muted small">
                                {new Date(r.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="mt-1">{r.message}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grievanceBlock mt-3">
                    <div className="fw-bold mb-2">Send Reply (Admin)</div>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={replyMsg}
                      onChange={(e) => setReplyMsg(e.target.value)}
                      placeholder="Write your reply..."
                    ></textarea>

                    <div className="d-flex justify-content-end mt-2">
                      <button
                        className="btn btn-primary"
                        disabled={submitting}
                        onClick={handleReply}
                      >
                        {submitting ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="col-lg-4">
                  <div className="grievanceSideCard">
                    <div className="fw-bold mb-2">Ticket Info</div>

                    <div className="small text-muted mb-2">
                      <b>Created By:</b>{" "}
                      {active?.createdBy?.fullName || "N/A"}
                      <br />
                      <b>Email:</b> {active?.createdBy?.email || "N/A"}
                      <br />
                      <b>Role:</b> {active.createdByRole}
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <span className={statusBadge(active.status)}>
                        {active.status.replace("_", " ")}
                      </span>
                      <span className={priorityBadge(active.priority)}>
                        {active.priority}
                      </span>
                      <span className="badge bg-dark text-capitalize">
                        {active.category}
                      </span>
                    </div>

                    <div className="small text-muted mb-2">
                      <b>Assigned To:</b>{" "}
                      {active?.assignedTo?.fullName || "Not assigned"}
                      <br />
                      {active?.assignedAt && (
                        <>
                          <b>Assigned At:</b>{" "}
                          {new Date(active.assignedAt).toLocaleString()}
                        </>
                      )}
                    </div>

                    <hr />

                    {/* ASSIGN TEACHER */}
                    <div className="fw-bold mb-2">Assign Teacher</div>

                    <label className="form-label small fw-semibold">
                      Select Teacher
                    </label>

                    <select
                      className="form-select"
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                    >
                      <option value="">-- Select Teacher --</option>

                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.fullName} ({t.email})
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn btn-outline-primary w-100 mt-2"
                      disabled={submitting || !selectedTeacher}
                      onClick={handleAssignTeacher}
                    >
                      {submitting ? "Assigning..." : "Assign Teacher"}
                    </button>

                    <hr />

                    {/* UPDATE STATUS */}
                    <div className="fw-bold mb-2">Update Status</div>

                    <label className="form-label small fw-semibold">
                      Status
                    </label>
                    <select
                      className="form-select"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                      <option value="closed">Closed</option>
                    </select>

                    <label className="form-label small fw-semibold mt-2">
                      Remarks
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Optional remarks..."
                    ></textarea>

                    <button
                      className="btn btn-success w-100 mt-3"
                      disabled={submitting}
                      onClick={handleUpdateStatus}
                    >
                      {submitting ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-end mt-3">
                <button
                  className="btn btn-outline-secondary"
                  onClick={closeDetails}
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

export default GrievancePanel;
