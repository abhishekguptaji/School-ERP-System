import React, { useState } from "react";
import "./LoginPage.css";

function LoginPage() {
  const [role, setRole] = useState("student");

  return (
    <div className="erp-login-container">
      <div className="row g-0 min-vh-100">

        {/* LEFT BRAND SECTION */}
        <div className="col-md-6 d-none d-md-flex erp-brand-section">
          <div className="brand-content">
            <h1 className="school-name">Gupta Ji Public School</h1>
            <h3 className="erp-name">Campus ERP</h3>
            <p className="tagline">
              Smart Digital School Management System
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN SECTION */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="login-card card shadow-sm">

            <div className="card-body p-4">

              <h4 className="text-center fw-bold mb-2">
                Login to Campus ERP
              </h4>
              <p className="text-center text-muted mb-4">
                Select role to continue
              </p>

              {/* ROLE SELECTOR */}
              <div className="btn-group w-100 mb-4">
                <button
                  className={`btn ${role === "student" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setRole("student")}
                >
                  Student
                </button>
                <button
                  className={`btn ${role === "teacher" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setRole("teacher")}
                >
                  Teacher
                </button>
                <button
                  className={`btn ${role === "admin" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setRole("admin")}
                >
                  Admin
                </button>
              </div>

              {/* LOGIN FORM */}
              <form>
                <div className="mb-3">
                  <label className="form-label">
                    {role === "student"
                      ? "Roll No / Email"
                      : role === "teacher"
                      ? "Employee ID / Email"
                      : "Admin Email"}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your login ID"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" />
                    <label className="form-check-label">Remember me</label>
                  </div>
                  <a href="#" className="small text-decoration-none">
                    Forgot Password?
                  </a>
                </div>

                <div className="d-grid">
                  <button className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>

              <p className="text-center text-muted mt-4 small">
                © {new Date().getFullYear()} Gupta Ji Public School
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
