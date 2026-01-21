import React from "react";
import "./TeacherNavbar.css";

function TeacherNavbar() {
  return (
    <nav className="navbar navbar-expand-lg teacher-navbar sticky-top">
      <div className="container-fluid">

        {/* BRAND */}
        <div className="d-flex align-items-center">
          <span className="school-brand">Gupta Ji Public School</span>
          <span className="erp-brand ms-2">Teacher ERP</span>
        </div>

        {/* TOGGLE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#teacherNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div className="collapse navbar-collapse" id="teacherNavbar">
          <ul className="navbar-nav mx-auto teacher-menu">

            <li className="nav-item">
              <a className="nav-link active" href="#">Dashboard</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">My Classes</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Attendance</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Marks</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Assignments</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Notices</a>
            </li>

          </ul>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-3">

            {/* Notifications */}
            <div className="notification-icon">
              <i className="bi bi-bell"></i>
              <span className="notification-dot"></span>
            </div>

            {/* Profile */}
            <div className="dropdown">
              <a
                href="#"
                className="d-flex align-items-center teacher-profile dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <img
                  src="https://i.pravatar.cc/32?img=12"
                  alt="teacher"
                  className="teacher-avatar"
                />
                <span className="ms-2">Teacher</span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="#">My Profile</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item text-danger" href="#">Logout</a></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default TeacherNavbar;
