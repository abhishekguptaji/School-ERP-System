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

  const [showPassword, setShowPassword] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const payload = {
      email: loginId.trim(),
      password: password.trim(),
      role,
    };

    const res = await loginUser(payload);

    localStorage.setItem("token", res.data.accessToken);
    localStorage.setItem("role", res.data.user.role);
    localStorage.setItem("user", JSON.stringify(res.data.user));

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
      text:
        error?.response?.data?.message ||
        "Invalid email or password. Please try again.",
    });
  } finally {
    setLoginId("");
    setPassword("");
    setLoading(false);
  }
};
  return (
    <div className="erp-login-container">
      <div className="row g-0 min-vh-100">
        {/* LEFT BRAND */}
        <div className="col-md-6 d-none d-md-flex erp-brand-section">
          <div className="brand-content">
            <div className="brand-badge">
              <i className="bi bi-mortarboard-fill"></i>
            </div>

            <h1 className="school-name">Gupta Ji Public School</h1>
            <h3 className="erp-name">Campus ERP</h3>
            <p className="tagline">Smart Digital School Management System</p>

            <div className="brand-points">
              <div className="point">
                <i className="bi bi-shield-check"></i>
                Role Based Secure Login
              </div>
              <div className="point">
                <i className="bi bi-calendar-check"></i>
                Attendance • Exams • Results • Fees
              </div>
              <div className="point">
                <i className="bi bi-speedometer2"></i>
                Fast Dashboard for Students & Teachers
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN */}
        <div className="col-md-6 d-flex align-items-center justify-content-center p-3">
          <div className="login-card card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="login-logo mb-2">
                  <i className="bi bi-building-fill-check"></i>
                </div>

                <h4 className="text-center fw-bold mb-1">
                  Login to Campus ERP
                </h4>
                <p className="text-center text-muted mb-0">
                  Select role to continue
                </p>
              </div>

              {/* ROLE SELECTOR */}
              <div className="role-tabs mb-4">
                {["student", "teacher", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`role-tab ${role === r ? "active" : ""}`}
                    onClick={() => setRole(r)}
                  >
                    <i
                      className={`bi ${
                        r === "student"
                          ? "bi-person-fill"
                          : r === "teacher"
                          ? "bi-person-workspace"
                          : "bi-shield-lock-fill"
                      }`}
                    ></i>
                    <span>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                  </button>
                ))}
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    {role === "student"
                      ? "Student Email / Roll No"
                      : role === "teacher"
                      ? "Teacher Email"
                      : "Admin Email"}
                  </label>

                  <div className="input-icon">
                    <i className="bi bi-person-circle"></i>
                    <input
                      type="text"
                      className="form-control"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder={
                        role === "student"
                          ? "Enter email"
                          : "Enter email"
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>

                  <div className="input-icon">
                    <i className="bi bi-key-fill "></i>

                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                    />

                    <button
                      type="button"
                      className="show-hide-btn"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="d-grid mt-4">
                  <button
                    className="btn btn-primary btn-lg rounded-3 fw-bold"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </>
                    )}
                  </button>
                </div>
              </form>

              <p className="text-center text-muted mt-4 small mb-0">
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
