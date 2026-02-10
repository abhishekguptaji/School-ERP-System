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
    <>
      {/* ===================== TOP NAVBAR ===================== */}
      <nav className="navbar navbar-expand-lg admin-navbar sticky-top">
        <div className="container-fluid px-3">
          {/* BRAND */}
          <div className="d-flex align-items-center gap-2">
            <Link className="school-brand nav-link p-0" to="/admin/dashboard">
              <span className="brand-title">Gupta Ji Public School</span>
            </Link>

            <span className="erp-brand ms-1">Admin ERP</span>
          </div>

          {/* TOGGLER */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminNavbar"
          >
            <i className="bi bi-list fs-2"></i>
          </button>

          {/* NAV CONTENT */}
          <div className="collapse navbar-collapse" id="adminNavbar">
            {/* CENTER MENU */}
            <ul className="navbar-nav mx-auto admin-menu top-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/admin/admin-profile">
                  <i className="bi bi-person-circle me-2"></i>
                  My Profile
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/admin/add-student">
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Add Student
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/admin/add-teacher">
                  <i className="bi bi-person-workspace me-2"></i>
                  Add Teacher
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/admin/show-classes">
                  <i className="bi bi-search me-2"></i>
                  Find Students
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/admin/grievance-profile">
                  <i className="bi bi-chat-left-text-fill me-2"></i>
                  Grievance Panel
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/admin/notices-panel">
                  <i className="bi bi-megaphone me-2"></i>

                  Notice Panel
                </Link>
              </li>
            </ul>

            {/* RIGHT SIDE */}
            <div className="d-flex align-items-center gap-3 ms-lg-3 mt-3 mt-lg-0">
              <button
                type="button"
                className="dropdown-item rounded-3 text-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===================== SECOND NAVBAR ===================== */}
      <nav className="navbar admin-sub-navbar">
        <div className="container-fluid px-3">
          <ul className="navbar-nav flex-row admin-menu sub-menu mx-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/manage-student">
                <i className="bi bi-people-fill me-2"></i>
                Manage Student
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/classes-subject">
                <i className="bi bi-journal-text me-2"></i>
                Class & Subject
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/attendence">
                <i className="bi bi-calendar-check-fill me-2"></i>
                Attendence
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/exams">
                <i className="bi bi-clipboard-check-fill me-2"></i>
                Exams
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/fees">
                <i className="bi bi-cash-coin me-2"></i>
                Fees
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/reports">
                <i className="bi bi-bar-chart-fill me-2"></i>
                Reports
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/settings">
                <i className="bi bi-gear-fill me-2"></i>
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default AdminNavbar;
