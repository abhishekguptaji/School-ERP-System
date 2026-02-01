import { useState } from "react";
function PasswordChange() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
    <div className="d-flex flex-column ">
      {/* MIDDLE CONTENT (SCROLLABLE) */}
      <div className="flex-grow-1 overflow-y-auto bg-light">
        <div className="container py-4">

          <div className="row justify-content-center">
            <div className="col-md-5">

              <div className="card shadow">
                <div className="card-body">
                  <h5 className="mb-4 text-center">Change Password</h5>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                      Update Password
                    </button>
                  </form>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default PasswordChange;
