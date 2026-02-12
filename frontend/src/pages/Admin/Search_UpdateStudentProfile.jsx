import "./css/Search_UpdateStudentProfile.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getAllStudentProfilesByAdmin,
  getCompleteStudentProfileByAdmin,
} from "../../services/adminService.js";

function Search_UpdateStudentProfile() {
  const [loading, setLoading] = useState(false);

  // search filters
  const [search, setSearch] = useState("");
  const [className, setClassName] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [pagination, setPagination] = useState(null);

  // data
  const [students, setStudents] = useState([]);

  // view modal
  const [active, setActive] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [completeData, setCompleteData] = useState(null);

  const fetchStudents = async (customPage = 1) => {
    try {
      setLoading(true);

      const params = {
        page: customPage,
        limit,
        search,
        className,
      };

      const res = await getAllStudentProfilesByAdmin(params);
     console.log("STUDENT LIST API RESPONSE =>", res);
      //your API format
      const studentsArr = res?.students || [];
      const pag = res?.pagination || null;

      setStudents(studentsArr);
      setPagination(pag);
      setPage(pag?.page || customPage);
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to load students",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   fetchStudents(1);
    // eslint-disable-next-line
  }, []);

  const openView = async (student) => {
    try {
      setActive(student);
      setCompleteData(null);
      setViewLoading(true);

      const res = await getCompleteStudentProfileByAdmin(student._id);

      // res.data => { user, profile, isProfileCreated }
      setCompleteData(res?.data || null);
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to load complete profile",
        "error",
      );
    } finally {
      setViewLoading(false);
    }
  };

  const closeView = () => {
    setActive(null);
    setCompleteData(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(1);
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="container-fluid px-5 adminStudentWrap">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h3 className="mb-0 fw-bold text-primary ">
            Search & View Student Profile
          </h3>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => fetchStudents(page)}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* SEARCH FILTERS */}
      {/* <div className="card shadow-sm border-0 studentSearchCard mb-3">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-2 align-items-end">
            <div className="col-lg-5 col-md-6">
              <label className="form-label fw-semibold">Search</label>
              <input
                className="form-control"
                placeholder="Search by Campus ID / Name / Email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-lg-5 col-md-3">
              <label className="form-label fw-semibold">Class</label>
              <input
                className="form-control"
                placeholder="ex: 10"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>

            <div className="col-lg-2 col-md-12 d-grid">
              <button className="btn btn-primary">
                <i className="bi bi-search me-2"></i>
                Search
              </button>
            </div>
          </form>
        </div>
      </div> */}

      {/* STUDENTS TABLE */}
      <div className="card shadow-sm border-0">
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
            <>
              <div className="table-responsive">
                <table className="table align-middle table-hover studentTable">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Campus ID</th>
                      <th>Class</th>
                      <th>Gender</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((s) => (
                      <tr key={s._id}>
                        <td>
                          <div className="fw-semibold">
                            {s?.user?.name || "N/A"}
                          </div>
                          <div className="text-muted small">
                            DOB: {s?.dob ? s.dob.slice(0, 10) : "N/A"}
                          </div>
                        </td>

                        <td className="fw-semibold text-primary">
                          {s?.user?.campusId || "N/A"}
                        </td>

                        <td>{s?.className ?? "N/A"}</td>

                        <td className="text-capitalize">
                          {s?.gender || "N/A"}
                        </td>

                        <td className="text-muted">
                          {s?.user?.email || "N/A"}
                        </td>

                        <td className="text-muted">
                          {s?.address?.city
                            ? `${s.address.city}, ${s.address.state} (${s.address.pincode})`
                            : "N/A"}
                        </td>

                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openView(s)}
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

              {/* PAGINATION */}
              <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                <div className="text-muted small">
                  Total: <b>{pagination?.total || students.length}</b>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={page <= 1 || loading}
                    onClick={() => fetchStudents(page - 1)}
                  >
                    Prev
                  </button>

                  <button className="btn btn-sm btn-light" disabled>
                    Page {page} / {totalPages}
                  </button>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={page >= totalPages || loading}
                    onClick={() => fetchStudents(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* VIEW MODAL */}
      {active && (
        <div className="studentModalBackdrop">
          <div className="studentModal card shadow-lg border-0">
            <div className="card-body p-0">
              {/* HEADER */}
              <div className="studentModalHeader">
                <div>
                  <h5 className="mb-0 fw-bold">Student Complete Profile</h5>
                  <div className="small opacity-75">
                    Profile ID:{" "}
                    <span className="fw-semibold">{active?._id}</span>
                  </div>
                </div>

                <button className="btn btn-sm btn-light" onClick={closeView}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              {/* BODY */}
              <div className="studentModalBody">
                {viewLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="text-muted mt-2 mb-0">
                      Loading complete profile...
                    </p>
                  </div>
                ) : !completeData ? (
                  <div className="text-center py-5 text-muted">
                    No data found
                  </div>
                ) : (
                  <>
                    {/* USER */}
                    <div className="infoSection">
                      <div className="infoSectionTitle">
                        <i className="bi bi-person-badge me-2"></i> User
                      </div>

                      <div className="infoGrid">
                        <div className="infoItem">
                          <div className="infoLabel">Name</div>
                          <div className="infoValue">
                            {completeData?.user?.name || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Email</div>
                          <div className="infoValue">
                            {completeData?.user?.email || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Campus ID</div>
                          <div className="infoValue text-primary">
                            {completeData?.user?.campusId || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PROFILE */}
                    <div className="infoSection">
                      <div className="infoSectionTitle">
                        <i className="bi bi-card-checklist me-2"></i> Profile
                      </div>

                      <div className="infoGrid">
                        <div className="infoItem">
                          <div className="infoLabel">Admission No</div>
                          <div className="infoValue">
                            {completeData?.profile?.admissionNumber || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Class</div>
                          <div className="infoValue">
                            {completeData?.profile?.className ?? "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Gender</div>
                          <div className="infoValue">
                            {completeData?.profile?.gender || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Blood Group</div>
                          <div className="infoValue">
                            {completeData?.profile?.bloodGroup || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">DOB</div>
                          <div className="infoValue">
                            {completeData?.profile?.dob
                              ? completeData.profile.dob.slice(0, 10)
                              : "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Age</div>
                          <div className="infoValue">
                            {completeData?.profile?.studentAge ?? "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Active</div>
                          <div
                            className={`infoBadge ${
                              completeData?.profile?.isActive
                                ? "badgeActive"
                                : "badgeInactive"
                            }`}
                          >
                            {completeData?.profile?.isActive ? "Yes" : "No"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Created At</div>
                          <div className="infoValue">
                            {completeData?.profile?.createdAt
                              ? completeData.profile.createdAt.slice(0, 10)
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="infoSection">
                      <div className="infoSectionTitle">
                        <i className="bi bi-geo-alt me-2"></i> Address
                      </div>

                      <div className="infoGrid">
                        <div className="infoItem">
                          <div className="infoLabel">City</div>
                          <div className="infoValue">
                            {completeData?.profile?.address?.city || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">State</div>
                          <div className="infoValue">
                            {completeData?.profile?.address?.state || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Pincode</div>
                          <div className="infoValue">
                            {completeData?.profile?.address?.pincode || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FATHER */}
                    <div className="infoSection">
                      <div className="infoSectionTitle">
                        <i className="bi bi-person me-2"></i> Father
                      </div>

                      <div className="infoGrid">
                        <div className="infoItem">
                          <div className="infoLabel">Name</div>
                          <div className="infoValue">
                            {completeData?.profile?.father?.name || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Phone</div>
                          <div className="infoValue">
                            {completeData?.profile?.father?.phone || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Occupation</div>
                          <div className="infoValue">
                            {completeData?.profile?.father?.occupation || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MOTHER */}
                    <div className="infoSection">
                      <div className="infoSectionTitle">
                        <i className="bi bi-person me-2"></i> Mother
                      </div>

                      <div className="infoGrid">
                        <div className="infoItem">
                          <div className="infoLabel">Name</div>
                          <div className="infoValue">
                            {completeData?.profile?.mother?.name || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Phone</div>
                          <div className="infoValue">
                            {completeData?.profile?.mother?.phone || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Occupation</div>
                          <div className="infoValue">
                            {completeData?.profile?.mother?.occupation || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GUARDIAN */}
                    <div className="infoSection">
                      <div className="infoSectionTitle">
                        <i className="bi bi-people me-2"></i> Guardian
                      </div>

                      <div className="infoGrid">
                        <div className="infoItem">
                          <div className="infoLabel">Name</div>
                          <div className="infoValue">
                            {completeData?.profile?.guardian?.name || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Relation</div>
                          <div className="infoValue">
                            {completeData?.profile?.guardian?.relation || "N/A"}
                          </div>
                        </div>

                        <div className="infoItem">
                          <div className="infoLabel">Phone</div>
                          <div className="infoValue">
                            {completeData?.profile?.guardian?.phone || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DOCUMENTS */}
                    <div className="infoSection mb-0">
                      <div className="infoSectionTitle">
                        <i className="bi bi-file-earmark-text me-2"></i>{" "}
                        Documents
                      </div>

                      <div className="infoGrid">
                        <div className="infoItem">
                          <div className="infoLabel">Aadhaar Number</div>
                          <div className="infoValue">
                            {completeData?.profile?.documents?.aadhaarNumber ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* FOOTER */}
              <div className="studentModalFooter">
                <button
                  className="btn btn-outline-secondary"
                  onClick={closeView}
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

export default Search_UpdateStudentProfile;
