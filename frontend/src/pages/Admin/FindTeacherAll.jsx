import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./css/FindTeacherAll.css";

import {
  getAllTeacherByAdmin,
  getIdTeacherByAdmin,
} from "../../services/adminService.js";

const STATUS_OPTIONS = ["all", "active", "inactive"];

function FindTeacherAll() {
  const [loading, setLoading] = useState(false);

  const [teachers, setTeachers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [department, setDepartment] = useState("all");

  const [page, setPage] = useState(1);
  const limit = 5;

  const [showView, setShowView] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const data = await getAllTeacherByAdmin({
        search,
        status,
        department,
        page,
        limit,
      });

      const payload = data?.data || data;

      setTeachers(payload?.teachers || []);
      setTotal(payload?.total || 0);
      setTotalPages(payload?.totalPages || 1);
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to fetch teachers",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [search, status, department, page]);

  const departmentOptions = useMemo(() => {
    const set = new Set();
    teachers.forEach((t) => t?.department && set.add(t.department));
    return ["all", ...Array.from(set)];
  }, [teachers]);

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("all");
    setDepartment("all");
    setPage(1);
  };

  const openViewModal = async (teacherId) => {
    try {
      setLoading(true);

      const res = await getIdTeacherByAdmin(teacherId);

      const teacher = res?.data?.teacher || res?.data || res;

      setSelectedTeacher(teacher);
      setShowView(true);
    } catch (err) {
      console.log(err);
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to fetch teacher details",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminTeachersPage">
      {/* Header */}
      <div className="adminTeachersHeader">
        <div>
          <h3 className="mb-1 fw-bold">Teachers</h3>
          <p className="mb-0 text-muted">
            Search, view and filter teacher profiles.
          </p>
        </div>

        <div className="adminTeachersStats">
          <div className="statCard">
            <div className="statLabel">Total Teachers</div>
            <div className="statValue">{total}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Page</div>
            <div className="statValue">
              {page} / {totalPages || n/a}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="adminTeachersFilters card shadow-sm border-0">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-lg-5 col-md-6">
              <label className="form-label fw-semibold">Search</label>
              <div className="searchBox">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, phone, teacherId..."
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
              <label className="form-label fw-semibold">Department</label>
              <select
                className="form-select"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPage(1);
                }}
              >
                {departmentOptions.map((d) => (
                  <option key={d} value={d}>
                    {d === "all" ? "ALL" : d}
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
      <div className="adminTeachersTableWrap card shadow-sm border-0 mt-3">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border"></div>
              <p className="mt-2 text-muted">Loading teachers...</p>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-emoji-frown fs-1 text-muted"></i>
              <h5 className="mt-2">No teachers found</h5>
              <p className="text-muted mb-0">
                Try changing filters or search keyword.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Teacher</th>
                    <th>Teacher ID</th>
                    <th>Department</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th style={{ width: "160px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {teachers.map((t, index) => (
                    <tr key={t._id}>
                      <td className="fw-semibold">
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td>
                        <div className="teacherCell">
                          <div className="teacherAvatar">
                            <i className="bi bi-person-fill"></i>
                          </div>
                          <div>
                            <div className="fw-bold">{t.user.name}</div>
                            <div className="text-muted small">
                              {t.user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge text-bg-light border">
                          {t.user.campusId}
                        </span>
                      </td>

                      <td>{t.department}</td>
                      <td>{t.phone}</td>

                      <td>
                        {t.status === "inactive" ? (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                            INACTIVE
                          </span>
                        ) : (
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            ACTIVE
                          </span>
                        )}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => openViewModal(t._id)}
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
          {!loading && teachers.length > 0 && (
            <div className="paginationBar">
              <button
                className="btn btn-outline-dark"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <i className="bi bi-chevron-left"></i> Prev
              </button>

              <div className="pageInfo">
                Page <b>{page}</b> of <b>{totalPages || 1}</b>
              </div>

              <button
                className="btn btn-outline-dark"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===================== VIEW MODAL ===================== */}
      {showView && selectedTeacher && (
        <div className="customModalBackdrop">
          <div className="customModalCard">
            <div className="modalHeader">
              <h5 className="mb-0 fw-bold">Teacher Details</h5>
              <button className="closeBtn" onClick={() => setShowView(false)}>
                ✕
              </button>
            </div>

            <div className="modalBody">
              <div className="detailGrid">
                <div>
                  <div className="label">Teacher Name</div>
                  <div className="value">
                    {selectedTeacher?.user?.name || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="label">Email</div>
                  <div className="value">
                    {selectedTeacher?.user?.email || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="label">Campus ID</div>
                  <div className="value">
                    {selectedTeacher?.user?.campusId || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="label">Phone</div>
                  <div className="value">{selectedTeacher?.phone || "N/A"}</div>
                </div>

                <div>
                  <div className="label">Department</div>
                  <div className="value">
                    {selectedTeacher?.department || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="label">Designation</div>
                  <div className="value">
                    {selectedTeacher?.designation || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="label">Qualification</div>
                  <div className="value">
                    {selectedTeacher?.qualification || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="label">Experience</div>
                  <div className="value">
                    {selectedTeacher?.experienceYears || 0} Years
                  </div>
                </div>

                <div>
                  <div className="label">Employment Type</div>
                  <div className="value">
                    {selectedTeacher?.employmentType || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="label">Status</div>
                  <div className="value">
                    {selectedTeacher?.status || "N/A"}
                  </div>
                </div>

                <div className="fullWidth">
                  <div className="label">Full Address</div>
                  <div className="value">
                    {selectedTeacher?.address?.fullAddress || "N/A"}
                  </div>
                </div>

                <div className="fullWidth">
                  <div className="label">Emergency Contact</div>
                  <div className="value">
                    {selectedTeacher?.emergencyContact?.name
                      ? `${selectedTeacher.emergencyContact.name} (${selectedTeacher.emergencyContact.relation}) - ${selectedTeacher.emergencyContact.phone}`
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div className="modalFooter">
              <button
                className="btn btn-dark"
                onClick={() => setShowView(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindTeacherAll;
