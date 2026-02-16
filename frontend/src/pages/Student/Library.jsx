import "./css/Library.css";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import {
  studentGetMyIssued,
  studentRequestReturn,
} from "../../services/authService.js";

const StudentLibrary = () => {
  const [issued, setIssued] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchIssued = async () => {
    try {
      setLoading(true);

      const res = await studentGetMyIssued();
      console.log(res);
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setIssued(list);
    } catch (err) {
      console.log(err);
      setIssued([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssued();
  }, []);

  const requestReturnHandler = async (copyMongoId) => {
    try {
      const confirm = await Swal.fire({
        title: "Request Return?",
        text: "Admin will accept after verification.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Request",
      });

      if (!confirm.isConfirmed) return;

      const res = await studentRequestReturn(copyMongoId);
      
      Swal.fire("Success", res.data?.message || "Return request sent", "success");
      fetchIssued();
    } catch (err) {
      console.log(err);

      // Swal.fire(
      //   "Error",
      //   err.response?.data?.message || err.message || "Something went wrong",
      //   "error"
      // );
    }
  };

  const filteredIssued = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return issued;

    return issued.filter((c) => {
      const title = c.book?.title?.toLowerCase() || "";
      const copyId = c.copyId?.toLowerCase() || "";
      return title.includes(q) || copyId.includes(q);
    });
  }, [issued, search]);

  return (
    <div className="container-fulid px-5">
      {/* TOP HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3 className="mb-0 fw-bold text-dark">My Library</h3>
          <p className="text-muted mb-0">
            View your issued books and request returns.
          </p>
        </div>

        <button
          className="btn btn-outline-dark btn-sm"
          onClick={fetchIssued}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="row g-3 mt-2">
        <div className="col-12 col-md-4">
          <div className="erpMiniCard">
            <div className="d-flex align-items-center gap-3">
              <div className="erpMiniIcon bg-primary-subtle text-primary">
                <i className="bi bi-journal-bookmark"></i>
              </div>
              <div>
                <div className="text-muted small">Total Issued</div>
                <div className="fw-bold fs-4">{issued.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="erpMiniCard">
            <div className="d-flex align-items-center gap-3">
              <div className="erpMiniIcon bg-warning-subtle text-warning">
                <i className="bi bi-clock-history"></i>
              </div>
              <div>
                <div className="text-muted small">Due Soon</div>
                <div className="fw-bold fs-4">
                  {
                    issued.filter((c) => {
                      if (!c.dueDate) return false;
                      const due = new Date(c.dueDate).getTime();
                      const now = Date.now();
                      const diffDays = Math.ceil(
                        (due - now) / (1000 * 60 * 60 * 24)
                      );
                      return diffDays >= 0 && diffDays <= 3;
                    }).length
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="erpMiniCard">
            <div className="d-flex align-items-center gap-3">
              <div className="erpMiniIcon bg-success-subtle text-success">
                <i className="bi bi-shield-check"></i>
              </div>
              <div>
                <div className="text-muted small">Status</div>
                <div className="fw-bold fs-6">
                  {issued.length > 0 ? "Active Issued Books" : "No Pending Issues"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="erpProfileCard mt-3">
        <div className="p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h5 className="fw-bold mb-0">My Issued Books</h5>
              <div className="text-muted small">
                Request return for any issued copy.
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="input-group input-group-sm" style={{ width: 280 }}>
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by book title / copyId"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-4 text-muted">Loading issued books...</div>
          ) : (
            <>
              {/* TABLE VIEW (Desktop) */}
              <div className="table-responsive d-none d-md-block">
                <table className="table table-bordered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "34%" }}>Book</th>
                      <th style={{ width: "14%" }}>Copy ID</th>
                      <th style={{ width: "14%" }}>Issued</th>
                      <th style={{ width: "14%" }}>Due</th>
                      <th style={{ width: "12%" }}>Status</th>
                      <th style={{ width: "12%" }}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredIssued.map((c) => {
                      const dueDays = c.dueDate
                        ? Math.ceil(
                            (new Date(c.dueDate).getTime() - Date.now()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : null;

                      const dueBadge =
                        dueDays === null
                          ? "bg-secondary"
                          : dueDays < 0
                          ? "bg-danger"
                          : dueDays <= 3
                          ? "bg-warning text-dark"
                          : "bg-success";

                      return (
                        <tr key={c._id}>
                          <td>
                            <div className="fw-semibold">{c.book?.title}</div>
                            <div className="text-muted small">
                              {c.book?.author || "—"}
                            </div>
                          </td>

                          <td className="fw-semibold">{c.copyId}</td>

                          <td>
                            {c.issuedAt
                              ? new Date(c.issuedAt).toLocaleDateString()
                              : "-"}
                          </td>

                          <td>
                            <div className="d-flex flex-column">
                              <span>
                                {c.dueDate
                                  ? new Date(c.dueDate).toLocaleDateString()
                                  : "-"}
                              </span>

                              {dueDays !== null && (
                                <span className={`badge ${dueBadge} mt-1 w-fit`}>
                                  {dueDays < 0
                                    ? `${Math.abs(dueDays)} days late`
                                    : `${dueDays} days left`}
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <span className="badge bg-danger-subtle text-danger">
                              Issued
                            </span>
                          </td>

                          <td>
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => requestReturnHandler(c._id)}
                            >
                              <i className="bi bi-arrow-return-left me-1"></i>
                              Return
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredIssued.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          No issued books found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* CARD VIEW (Mobile) */}
              <div className="d-md-none">
                {filteredIssued.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    No issued books found.
                  </div>
                ) : (
                  <div className="row g-3">
                    {filteredIssued.map((c) => {
                      const dueDays = c.dueDate
                        ? Math.ceil(
                            (new Date(c.dueDate).getTime() - Date.now()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : null;

                      const dueBadge =
                        dueDays === null
                          ? "bg-secondary"
                          : dueDays < 0
                          ? "bg-danger"
                          : dueDays <= 3
                          ? "bg-warning text-dark"
                          : "bg-success";

                      return (
                        <div className="col-12" key={c._id}>
                          <div className="erpMobileCard">
                            <div className="d-flex justify-content-between gap-2">
                              <div>
                                <div className="fw-bold">{c.book?.title}</div>
                                <div className="text-muted small">
                                  Copy: <span className="fw-semibold">{c.copyId}</span>
                                </div>
                              </div>
                              <span className="badge bg-danger-subtle text-danger h-fit">
                                Issued
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="d-flex justify-content-between">
                              <div>
                                <div className="text-muted small">Issued</div>
                                <div className="fw-semibold">
                                  {c.issuedAt
                                    ? new Date(c.issuedAt).toLocaleDateString()
                                    : "-"}
                                </div>
                              </div>

                              <div className="text-end">
                                <div className="text-muted small">Due</div>
                                <div className="fw-semibold">
                                  {c.dueDate
                                    ? new Date(c.dueDate).toLocaleDateString()
                                    : "-"}
                                </div>
                                {dueDays !== null && (
                                  <span className={`badge ${dueBadge} mt-1`}>
                                    {dueDays < 0
                                      ? `${Math.abs(dueDays)} days late`
                                      : `${dueDays} days left`}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              className="btn btn-warning btn-sm w-100 mt-3"
                              onClick={() => requestReturnHandler(c._id)}
                            >
                              <i className="bi bi-arrow-return-left me-1"></i>
                              Request Return
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLibrary;