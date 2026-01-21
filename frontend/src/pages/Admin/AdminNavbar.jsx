import React from "react";
import "./css/AdminNavbar.css";

function AdminNavbar() {
  return (
    <nav className="navbar navbar-expand-lg admin-navbar sticky-top">
      <div className="container-fluid">

        {/* BRAND */}
        <div className="d-flex align-items-center">
          <span className="school-brand">Gupta Ji Public School</span>
          <span className="erp-brand ms-2">Campus ERP</span>
        </div>

        {/* TOGGLE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav mx-auto admin-menu">

            <li className="nav-item">
              <a className="nav-link active" href="#">Dashboard</a>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                Students
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Add Student</a></li>
                <li><a className="dropdown-item" href="#">Manage Students</a></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                Teachers
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Add Teacher</a></li>
                <li><a className="dropdown-item" href="#">Assign Classes</a></li>
              </ul>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Exams</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Fees</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Reports</a>
            </li>
          </ul>

          {/* RIGHT ICONS */}
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
                className="d-flex align-items-center admin-profile dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <img
                  src="https://i.pravatar.cc/32"
                  alt="admin"
                  className="admin-avatar"
                />
                <span className="ms-2">Admin</span>
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

export default AdminNavbar;
