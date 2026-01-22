import React from "react";
import "./css/AdminNavbar.css";

import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

function AdminNavbar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg admin-navbar sticky-top">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <span className="school-brand">
            <a className="nav-link " href="/admin/dashboard">
                Gupta Ji Public School
              </a>
            
            
            
            </span>
          <span className="erp-brand ms-2">Campus ERP</span>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav mx-auto admin-menu">
            <li className="nav-item">
              <a className="nav-link " href="/admin/admin-profile">
                My Profile
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link " href="/admin/add-student">
                Add Student
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link " href="/admin/add-teacher">
                Add Teacher
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/admin/grievance-profile">
                Grievance Panel
              </a>
            </li>

            {/* <li className="nav-item">
              <a className="nav-link" href="#">
                Fees
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Reports
              </a>
            </li> */}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <div className="notification-icon">
              <i className="bi bi-bell"></i>
              <span className="notification-dot"></span>
            </div>
            <div className="dropdown">
              <a
                href="#"
                className="d-flex align-items-center admin-profile dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <span className="ms-2">Admin Name</span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    My Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item text-danger" href="#">
                    <button type="button" onClick={handleLogout}>
                      Logout
                    </button>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
