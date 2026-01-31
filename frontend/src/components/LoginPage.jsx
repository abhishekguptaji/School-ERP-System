import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./css/LoginPage.css";

import Swal from "sweetalert2";

function LoginPage() {
  const navigate = useNavigate();
  
  const [role, setRole] = useState("student");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {   
    e.preventDefault();

    try {
      setLoading(true);

      const payload = { password, role };

      if (loginId.includes("@")) {
        payload.email = loginId;
      } else {
        payload.rollNumber = loginId;
      }

      const res = await loginUser(payload);
      // console.log(res);
      // console.log(res.data.user.role);
      // SAVE AUTH DATA
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.user));

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.response?.data?.message ||
          "Invalid email or password. Please try again.",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#d33",
        background: "#ffffff",
        backdrop: "rgba(0,0,0,0.6)",
        allowOutsideClick: false,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="erp-login-container">
      <div className="row g-0 min-vh-100">
        {/* LEFT BRAND */}
        <div className="col-md-6 d-none d-md-flex erp-brand-section">
          <div className="brand-content">
            <h1 className="school-name">Gupta Ji Public School</h1>
            <h3 className="erp-name">Campus ERP</h3>
            <p className="tagline">Smart Digital School Management System</p>
          </div>
        </div>

        {/* RIGHT LOGIN */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="login-card card shadow-sm">
            <div className="card-body p-4">
              <h4 className="text-center fw-bold mb-2">Login to Campus ERP</h4>
              <p className="text-center text-muted mb-4">
                Select role to continue
              </p>

              {/* ROLE SELECTOR */}
              <div className="btn-group w-100 mb-4">
                {["student", "teacher", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`btn ${
                      role === r ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setRole(r)}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit}>
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
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
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
