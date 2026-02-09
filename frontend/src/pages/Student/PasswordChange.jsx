import { useState } from "react";

function PasswordChange() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    // 🔹 API CALL WILL COME HERE
    console.log("Password Data:", formData);

    alert("Password changed successfully (demo)");

    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-vh-80 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-4">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-white text-primary rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: 48, height: 48 }}
              >
                <i className="bi bi-shield-lock fs-4"></i>
              </div>

              <div>
                <h4 className="mb-0 fw-semibold">Change Password</h4>
                <small className="text-white-50">
                  Update your password securely
                </small>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {/* Current Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Current Password
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-key"></i>
                  </span>

                  <input
                    type={showPassword.currentPassword ? "text" : "password"}
                    className="form-control"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter current password"
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        currentPassword: !showPassword.currentPassword,
                      })
                    }
                  >
                    <i
                      className={`bi ${
                        showPassword.currentPassword
                          ? "bi-eye-slash"
                          : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">New Password</label>

                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-lock"></i>
                  </span>

                  <input
                    type={showPassword.newPassword ? "text" : "password"}
                    className="form-control"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter new password"
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        newPassword: !showPassword.newPassword,
                      })
                    }
                  >
                    <i
                      className={`bi ${
                        showPassword.newPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>

                <small className="text-muted">
                  Tip: Use at least 8 characters with letters & numbers.
                </small>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Confirm New Password
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-lock-fill"></i>
                  </span>

                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Re-enter new password"
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirmPassword: !showPassword.confirmPassword,
                      })
                    }
                  >
                    <i
                      className={`bi ${
                        showPassword.confirmPassword
                          ? "bi-eye-slash"
                          : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>

                {/* UI only feedback */}
                {formData.confirmPassword.length > 0 && (
                  <small
                    className={`fw-semibold ${
                      formData.newPassword === formData.confirmPassword
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {formData.newPassword === formData.confirmPassword ? (
                      <>
                        <i className="bi bi-check-circle me-1"></i> Passwords
                        match
                      </>
                    ) : (
                      <>
                        <i className="bi bi-x-circle me-1"></i> Passwords do not
                        match
                      </>
                    )}
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold py-2 rounded-3"
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Update Password
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PasswordChange;
