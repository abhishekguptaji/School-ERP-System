import React from "react";
import "./css/TeacherNavbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

function TeacherNavbar() {
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
      <nav className="navbar navbar-expand-lg teacher-navbar sticky-top">
        <div className="container-fluid">
          {/* BRAND */}
          <div className="d-flex align-items-center gap-2">
            <Link className="teacher-brand" to="/teacher/dashboard">
              Gupta Ji Public School
            </Link>
            <span className="teacher-subBrand">Teacher ERP</span>
          </div>

          {/* TOGGLER */}
          <button
            className="navbar-toggler teacher-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#teacherNavbarTop"
          >
            <i className="bi bi-list text-white"></i>
          </button>

          {/* TOP RIGHT */}
          <div className="collapse navbar-collapse" id="teacherNavbarTop">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2 mt-3 mt-lg-0">
              <li className="nav-item">
                <Link className={`nav-link teacher-topLink ${isActive("/teacher/dashboard") ? "active" : ""}`} to="/teacher/dashboard">
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link teacher-topLink ${isActive("/teacher/attendance") ? "active" : ""}`} to="/teacher/attendance">
                  <i className="bi bi-calendar-check me-1"></i> Attendance
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link teacher-topLink ${isActive("/teacher/students") ? "active" : ""}`} to="/teacher/students">
                  <i className="bi bi-people me-1"></i> Students
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link teacher-topLink ${isActive("/teacher/notices") ? "active" : ""}`} to="/teacher/notices">
                  <i className="bi bi-megaphone me-1"></i> Notices
                </Link>
              </li>
               <li className="nav-item">
                <Link className={`nav-link teacher-topLink ${isActive("/teacher/grievances") ? "active" : ""}`} to="/teacher/grievances">
                  <i className="bi bi-exclamation-circle me-1"></i> Grievances
                </Link>
              </li>

              {/* ACTION GROUP */}
              <li className="nav-item d-flex align-items-center gap-3 ms-lg-3 mt-3 mt-lg-0 border-lg-start ps-lg-3">
                <button className="teacher-iconBtn" title="Notifications">
                  <i className="bi bi-bell"></i>
                  <span className="teacher-dot"></span>
                </button>

                <button className="teacher-logoutBtn" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* SECONDARY MENU: Operational Tools */}
      <nav className="teacher-subNavbar px-4">
        <div className="container-fluid">
          <div className="teacher-subMenu">
            <Link className={`teacher-subLink ${isActive("/teacher/profile") ? "active" : ""}`} to="/teacher/profile">
              <i className="bi bi-person-badge me-2"></i> Profile
            </Link>
            <Link className={`teacher-subLink ${isActive("/teacher/timetable") ? "active" : ""}`} to="/teacher/timetable">
              <i className="bi bi-clock-history me-2"></i> Timetable
            </Link>

            <Link className={`teacher-subLink ${isActive("/teacher/material") ? "active" : ""}`} to="/teacher/material">
              <i className="bi bi-book me-2"></i> Study Material
            </Link>

            <Link className={`teacher-subLink ${isActive("/teacher/assignments") ? "active" : ""}`} to="/teacher/assignments">
              <i className="bi bi-journal-text me-2"></i> Assignments
            </Link>

            <Link className={`teacher-subLink ${isActive("/teacher/attendance/report") ? "active" : ""}`} to="/teacher/attendance/report">
              <i className="bi bi-file-earmark-text me-2"></i> Attendance Report
            </Link>

            <Link className={`teacher-subLink ${isActive("/teacher/marks") ? "active" : ""}`} to="/teacher/marks">
              <i className="bi bi-graph-up-arrow me-2"></i> Marks Upload
            </Link>

            <Link className={`teacher-subLink ${isActive("/teacher/results") ? "active" : ""}`} to="/teacher/results">
              <i className="bi bi-clipboard-check me-2"></i> Result Sheet
            </Link>

            <Link className={`teacher-subLink ${isActive("/teacher/leave") ? "active" : ""}`} to="/teacher/leave">
              <i className="bi bi-envelope-paper me-2"></i> Leave
            </Link>

            <Link className={`teacher-subLink ${isActive("/teacher/change-password") ? "active" : ""}`} to="/teacher/change-password">
              <i className="bi bi-shield-lock me-2"></i> 
              Password Change
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default TeacherNavbar;