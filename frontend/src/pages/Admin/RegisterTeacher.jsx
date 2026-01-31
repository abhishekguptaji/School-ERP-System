import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import AdminFooter from "./AdminFooter";
import AdminNavbar from "./AdminNavbar";

import Swal from "sweetalert2";


function RegisterTeacher() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    password: "",
    role: "teacher",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await registerUser(formData);

    setLoading(false);

    if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Teacher registered successfully",
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
    <>
      <div className="d-flex flex-column vh-100">
        <AdminNavbar />
        <div className="flex-grow-1 overflow-auto">
          <div className="container mt-4 mb-5">
            <div className="row justify-content-center">
              <div className="col-md-5">
                <div className="card shadow">
                  <div className="card-body">
                    <h4 className="text-center mb-4">Register New Teacher</h4>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Teacher Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Employee ID</label>
                        <input
                          type="text"
                          className="form-control"
                          name="employeeId"
                          value={formData.employeeId}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                      >
                        {loading ? "Registering..." : "Register Teacher"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AdminFooter />
      </div>
    </>
  );
}

export default RegisterTeacher;
