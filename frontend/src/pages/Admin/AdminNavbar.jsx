import "./css/AdminNavbar.css";
import { Link } from "react-router-dom";
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
            <Link className="nav-link " to="/admin/dashboard">
              Gupta Ji Public School
            </Link>
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
              <Link className="nav-link" to="/admin/admin-profile">
                My Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link " to="/admin/add-student">
                Add Student
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link " to="/admin/add-teacher">
                Add Teacher
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/grievance-profile">
                Grievance Panel
              </Link>
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
              <Link
                href="#"
                className="d-flex align-items-center admin-profile dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <span className="ms-2">Admin Name</span>
              </Link>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/admin/admin-profile">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">
                    Settings
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item text-danger" to="#">
                    <button type="button" onClick={handleLogout}>
                      Logout
                    </button>
                  </Link>
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
