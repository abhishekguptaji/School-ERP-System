import { useEffect, useState } from "react";
import { getShortProfileStudent } from "../../services/authService.js";
import "./css/StudentDashboard.css";

function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const fetchStudent = async () => {
    setLoading(true);
    setError("");

    const res = await getShortProfileStudent();

    if (!res?.success) {
      setError(res?.message || "Failed to load student data");
      setLoading(false);
      return;
    }

    setStudent(res?.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <div className="mt-2 fw-semibold">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stuDErrorWrap">
        <div className="stuDErrorCard">
          <div className="stuDErrorIcon">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>

          <h4 className="fw-bold mb-1">Complete The Profile First</h4>
          <p className="text-muted mb-3">{error}</p>

          <button className="stuDRetryBtn" onClick={fetchStudent}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const user = student?.user;

  return (
    <div className="stuDPage">
      <div className="container-fluid stuDContainer">
       
        {/* TOP CARD */}
        <div className="card stuDTopCard mb-4">
          <div className="stuDTopCardHeader">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="stuDAvatar">
                  <img
                    src={student?.userImage || "/default-user.png"}
                    alt="student"
                  />
                </div>

                <div>
                  <div className="stuDName">{user?.name || "-"}</div>
                  <div className="stuDEmail">{user?.email || "-"}</div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <span className="stuDBadge">
                  <i className="bi bi-upc-scan me-2"></i>
                  Campus ID: <b>{user?.campusId || "-"}</b>
                </span>

                <span className="stuDBadge">
                  <i className="bi bi-telephone-fill me-2"></i>
                  Father: <b>{student?.father?.phone || "-"}</b>
                </span>
              </div>
            </div>
          </div>

          <div className="card-body stuDBody">
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <div className="stuDInfoBox">
                  <div className="stuDInfoLabel">Student Name</div>
                  <div className="stuDInfoValue">{user?.name || "-"}</div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="stuDInfoBox">
                  <div className="stuDInfoLabel">Email</div>
                  <div className="stuDInfoValue">{user?.email || "-"}</div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="stuDInfoBox">
                  <div className="stuDInfoLabel">Admission No</div>
                  <div className="stuDInfoValue">{user?.campusId || "-"}</div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="stuDInfoBox">
                  <div className="stuDInfoLabel">Father Mobile</div>
                  <div className="stuDInfoValue">
                    {student?.father?.phone || "-"}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="stuDQuickCard">
              <div className="stuDQuickIcon">
                <i className="bi bi-person-badge"></i>
              </div>
              <div className="stuDQuickTitle">My Profile</div>
              <div className="stuDQuickText">Update personal details</div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="stuDQuickCard">
              <div className="stuDQuickIcon">
                <i className="bi bi-calendar2-week"></i>
              </div>
              <div className="stuDQuickTitle">Time Table</div>
              <div className="stuDQuickText">View class schedule</div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="stuDQuickCard">
              <div className="stuDQuickIcon">
                <i className="bi bi-clipboard-check"></i>
              </div>
              <div className="stuDQuickTitle">Attendance</div>
              <div className="stuDQuickText">Track attendance record</div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="stuDQuickCard">
              <div className="stuDQuickIcon">
                <i className="bi bi-chat-left-text"></i>
              </div>
              <div className="stuDQuickTitle">Grievance</div>
              <div className="stuDQuickText">Raise a complaint ticket</div>
            </div>
          </div>
        </div>

        <div style={{ height: 10 }}></div>
      </div>
    </div>
  );
}

export default StudentDashboard;