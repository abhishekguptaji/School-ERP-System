import React from "react";
import "./css/StudentNavbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../../services/authService";

function StudentNavbar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser({});

    // clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // redirect to main page
    navigate("/", { replace: true });
  };
  return (
    <nav className="navbar navbar-expand-lg erp-navbar">
      <div className="container-fluid">
        <h3 className="text-white">
          <Link className="nav-link" to="/student/dashboard">
            <span className="text-white" style={{ textDecoration: "none" }}>
              Campus ERP
            </span>
          </Link>
        </h3>

        {/* Toggle (Mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#erpNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="erpNavbar">
          <ul className="navbar-nav mx-auto erp-menu">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bi bi-file-earmark-text"></i> Apply Forms
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bi bi-laptop"></i> LMS
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bi bi-award"></i> Scholarship Undertaking
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link active" href="#">
                <i className="bi bi-pencil-square"></i> Registration-2025
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bi bi-exclamation-circle"></i> Grievance
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bi bi-people"></i> Library
              </a>
            </li>

            <li className="nav-item">
              <Link to="/student/password-change" className="nav-link text-white">
                <i className="bi bi-key"></i>Password
              </Link>
            </li>
          </ul>

          {/* Logout */}
          <div className="d-flex">
            <a className="nav-link logout-link" href="#">
              <i className="bi bi-box-arrow-right"></i>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default StudentNavbar;
