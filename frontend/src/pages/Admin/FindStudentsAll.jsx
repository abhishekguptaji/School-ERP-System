import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./css/FindStudentsAll.css";

import {
  getAllStudentsByAdmin,
  getIdStudentByAdmin,
} from "../../services/adminService.js";

const STATUS_OPTIONS = ["all", "active", "inactive"];

function FindStudentsAll() {
  // loading
  const [loading, setLoading] = useState(true);

  // filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [className, setClassName] = useState("all");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [pagination, setPagination] = useState(null);

  // data
  const [students, setStudents] = useState([]);

  // modals
  const [showView, setShowView] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // view data
  const [viewLoading, setViewLoading] = useState(false);
  const [completeData, setCompleteData] = useState(null);

  //  debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 450);

    return () => clearTimeout(timer);
  }, [searchInput]);

  //  fetch students from backend
  const fetchStudents = async (customPage = 1) => {
    try {
      setLoading(true);

      const res = await getAllStudentsByAdmin({
        search,
        status,
        className,
        page: customPage,
        limit,
      });

      // ApiResponse format (because service returns `data`)
      const studentsArr = res?.data?.students || [];

      const pag = {
        total: res?.data?.total || 0,
        page: res?.data?.page || customPage,
        limit: res?.data?.limit || limit,
        totalPages: res?.data?.totalPages || 1,
      };

      setStudents(studentsArr);
      setPagination(pag);
      setPage(pag.page);
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load students",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // auto fetch when filters change
  useEffect(() => {
    fetchStudents(page);
    // eslint-disable-next-line
  }, [search, status, className, page]);

  // totals
  const total = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  // class dropdown options (dynamic from current list)
  const CLASS_OPTIONS = useMemo(() => {
    const set = new Set();
    students.forEach((s) => s?.className && set.add(s.className));
    return ["all", ...Array.from(set)];
  }, [students]);

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("all");
    setClassName("all");
    setPage(1);
  };

  // ================= VIEW =================
  const openViewModal = async (student) => {
    try {
      setSelectedStudent(student);
      setCompleteData(null);
      setShowView(true);
      setViewLoading(true);

      const res = await getIdStudentByAdmin(student._id);

      // ApiResponse -> data
      setCompleteData(res?.data || null);
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to load student details",
        "error"
      );
      setShowView(false);
    } finally {
      setViewLoading(false);
    }
  };

  const closeView = () => {
    setShowView(false);
    setSelectedStudent(null);
    setCompleteData(null);
  };

  return (
    <div className="adminStudentsPage">
      {/* Header */}
      <div className="adminStudentsHeader">
        <div>
          <h3 className="mb-1 fw-bold">Students</h3>
          <p className="mb-0 text-muted">
            Search + filter + pagination + view student profile (Backend Data).
          </p>
        </div>

        <div className="adminStudentsStats">
          <div className="statCard">
            <div className="statLabel">Total Students</div>
            <div className="statValue">{total}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Page</div>
            <div className="statValue">
              {page} / {totalPages}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="adminStudentsFilters card shadow-sm border-0">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-lg-5 col-md-6">
              <label className="form-label fw-semibold">Search</label>
              <div className="searchBox">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, campusId, admission..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label fw-semibold">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold">Class</label>
              <select
                className="form-select"
                value={className}
                onChange={(e) => {
                  setClassName(e.target.value);
                  setPage(1);
                }}
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "ALL" : `Class ${c}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 col-md-6 d-grid">
              <button className="btn btn-dark" onClick={resetFilters}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="adminStudentsTableWrap card shadow-sm border-0 mt-3">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="text-muted mt-2 mb-0">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-person-x fs-1 text-muted"></i>
              <p className="text-muted mt-2 mb-0">No students found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Campus ID</th>
                    <th>Admission</th>
                    <th>Class</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th style={{ width: "120px" }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((s, index) => (
                    <tr key={s._id}>
                      <td className="fw-semibold">
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td>
                        <div className="studentCell">
                          <div className="studentAvatar">
                            <i className="bi bi-mortarboard-fill"></i>
                          </div>
                          <div>
                            <div className="fw-bold">
                              {s?.user?.name || "N/A"}
                            </div>
                            <div className="text-muted small">
                              {s?.user?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge text-bg-light border">
                          {s?.user?.campusId || "N/A"}
                        </span>
                      </td>

                      <td>{s?.admissionNumber || "N/A"}</td>
                      <td>{s?.className || "N/A"}</td>

                      <td className="text-capitalize">{s?.gender || "N/A"}</td>

                      <td>
                        {s?.isActive ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                            INACTIVE
                          </span>
                        )}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => openViewModal(s)}
                        >
                          <i className="bi bi-eye me-1"></i> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {students.length > 0 && (
            <div className="paginationBar">
              <button
                className="btn btn-outline-dark"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <i className="bi bi-chevron-left"></i> Prev
              </button>

              <div className="pageInfo">
                Page <b>{page}</b> of <b>{totalPages}</b>
              </div>

              <button
                className="btn btn-outline-dark"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===================== VIEW MODAL ===================== */}
      {showView && (
        <div className="customModalBackdrop">
          <div className="customModalCard">
            <div className="modalHeader">
              <h5 className="mb-0 fw-bold">Student Details</h5>
              <button className="closeBtn" onClick={closeView}>
                ✕
              </button>
            </div>

            <div className="modalBody">
              {viewLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                  <p className="text-muted mt-2 mb-0">
                    Loading student details...
                  </p>
                </div>
              ) : !completeData ? (
                <div className="text-center py-5 text-muted">No data found</div>
              ) : (
                <div className="detailGrid">
                  <div>
                    <div className="label">Name</div>
                    <div className="value">{completeData?.user?.name}</div>
                  </div>

                  <div>
                    <div className="label">Campus ID</div>
                    <div className="value">{completeData?.user?.campusId}</div>
                  </div>

                  <div>
                    <div className="label">Email</div>
                    <div className="value">{completeData?.user?.email}</div>
                  </div>

                  <div>
                    <div className="label">Admission No</div>
                    <div className="value">
                      {completeData?.admissionNumber || "N/A"}
                    </div>
                  </div>

                  <div>
                    <div className="label">Class</div>
                    <div className="value">
                      {completeData?.className || "N/A"}
                    </div>
                  </div>

                  <div>
                    <div className="label">Gender</div>
                    <div className="value text-capitalize">
                      {completeData?.gender || "N/A"}
                    </div>
                  </div>

                  <div>
                    <div className="label">DOB</div>
                    <div className="value">
                      {completeData?.dob
                        ? completeData.dob.slice(0, 10)
                        : "N/A"}
                    </div>
                  </div>

                  <div>
                    <div className="label">Status</div>
                    <div className="value">
                      {completeData?.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>

                  <div className="fullWidth">
                    <div className="label">Address</div>
                    <div className="value">
                      {completeData?.address?.city
                        ? `${completeData.address.city}, ${completeData.address.state} (${completeData.address.pincode})`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modalFooter">
              <button className="btn btn-dark" onClick={closeView}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindStudentsAll;