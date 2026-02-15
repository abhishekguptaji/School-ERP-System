import React from "react";
import "./css/StudentNavbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

function StudentNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser({});
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* TOP NAVBAR: Global Navigation */}
      <nav className="navbar navbar-expand-lg student-navbar sticky-top">
        <div className="container-fluid">
          {/* BRAND */}
          <div className="d-flex align-items-center gap-2">
            <Link className="student-brand" to="/student/dashboard">
              Gupta Ji Public School
            </Link>
            <span className="student-subBrand">Student ERP</span>
          </div>

          {/* TOGGLER */}
          <button
            className="navbar-toggler student-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#studentNavbarTop"
          >
            <i className="bi bi-list text-white"></i>
          </button>

          {/* TOP RIGHT */}
          <div className="collapse navbar-collapse" id="studentNavbarTop">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2 mt-3 mt-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link student-topLink ${
                    isActive("/student/dashboard") ? "active" : ""
                  }`}
                  to="/student/dashboard"
                >
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Link>
              </li>



              <li className="nav-item">
                <Link
                  className={`nav-link student-topLink ${
                    isActive("/student/stu-grievance") ? "active" : ""
                  }`}
                  to="/student/stu-grievance"
                >
                  <i className="bi bi-exclamation-circle me-1"></i> Grievances
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link student-topLink ${
                    isActive("/student/library") ? "active" : ""
                  }`}
                  to="/student/library"
                >
                  <i className="bi bi-book me-1"></i> Library
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link student-topLink ${
                    isActive("/student/notice-board") ? "active" : ""
                  }`}
                  to="/student/notice-board"
                >
                  <i className="bi bi-megaphone me-1"></i> Notices
                </Link>
              </li>

              {/* ACTION GROUP */}
              <li className="nav-item d-flex align-items-center gap-3 ms-lg-3 mt-3 mt-lg-0 border-lg-start ps-lg-3">
                <button className="student-iconBtn" title="Notifications">
                  <i className="bi bi-bell"></i>
                  <span className="student-dot"></span>
                </button>

                <button className="student-logoutBtn" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* SECONDARY MENU: Operational Tools */}
      <nav className="student-subNavbar px-4">
        <div className="container-fluid">
          <div className="student-subMenu px-5">
            <Link
              className={`student-subLink ${
                isActive("/student/stu-profile") ? "active" : ""
              }`}
              to="/student/stu-profile"
            >
              <i className="bi bi-person-badge me-2"></i> Profile
            </Link>

             <Link
              className={`student-subLink ${
                isActive("/student/apply-form") ? "active" : ""
              }`}
              to="/student/apply-form"
            >
              <i className="bi bi-file-earmark-text me-1"></i> Apply Form
            </Link>

            <Link
              className={`student-subLink ${
                isActive("/student/time-table") ? "active" : ""
              }`}
              to="/student/time-table"
            >
              <i className="bi bi-clock-history me-2"></i> Timetable
            </Link>

            <Link
              className={`student-subLink ${
                isActive("/student/study-material") ? "active" : ""
              }`}
              to="/student/study-material"
            >
              <i className="bi bi-book me-2"></i> Study Material
            </Link>

            <Link
              className={`student-subLink ${
                isActive("/student/attendence") ? "active" : ""
              }`}
              to="/student/attendence"
            >
              <i className="bi bi-clipboard-check me-2"></i> Attendance
            </Link>

            <Link
              className={`student-subLink ${
                isActive("/student/stu-fee") ? "active" : ""
              }`}
              to="/student/stu-fee"
            >
              <i className="bi bi-cash-stack me-2"></i> Fee
            </Link>

            <Link
              className={`student-subLink ${
                isActive("/student/results") ? "active" : ""
              }`}
              to="/student/results"
            >
              <i className="bi bi-clipboard-check me-2"></i> Result
            </Link>

            <Link
              className={`student-subLink ${
                isActive("/student/leave-permission") ? "active" : ""
              }`}
              to="/student/leave-permission"
            >
              <i className="bi bi-envelope-paper me-2"></i> Leave
            </Link>

            <Link
              className={`student-subLink ${
                isActive("/student/password-change") ? "active" : ""
              }`}
              to="/student/password-change"
            >
              <i className="bi bi-shield-lock me-2"></i> Password Change
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default StudentNavbar;