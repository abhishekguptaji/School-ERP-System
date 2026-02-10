import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import Swal from "sweetalert2";
import "./css/RegisterStu.css";

function RegisterStu() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await registerUser(formData);

    setLoading(false);

    if (response.success) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Student registered successfully",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/admin/dashboard");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: response.message,
      });
    }
  };

  return (
    <div className="registerStuPage">
      <div className="container py-4" style={{ maxWidth: 980 }}>
        {/* CARD */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-6">
            <div className="card registerCard border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h5 className="text-center fw-bold mb-1">
                  Student Registration Form
                </h5>

                <form onSubmit={handleSubmit}>
                  {/* EMAIL */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-envelope-fill"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@gmail.com"
                        required
                      />
                    </div>
                  </div>

                  {/* NAME */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Student Name
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-person-fill"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter student full name"
                        required
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        required
                      />
                    </div>

                    <div className="form-text">
                      Use at least 8 characters, including numbers & symbols.
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 registerBtn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Registering...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Register Student
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterStu;
