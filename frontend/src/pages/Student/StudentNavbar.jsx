import "./css/StudentNavbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

function StudentNavbar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <>
    <div className="student-navbar">
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
              <Link className="nav-link" to="">
                <i className="bi bi-file-earmark-text"></i> Apply Forms
             </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="">
                <i className="bi bi-laptop"></i> LMS
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="">
                <i className="bi bi-award"></i> Scholarship Undertaking
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="">
                <i className="bi bi-pencil-square"></i> Registration-2025
             </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="">
                <i className="bi bi-exclamation-circle"></i> Grievance
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="">
                <i className="bi bi-people"></i> Library
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/student/password-change"
                className="nav-link text-white"
              >
                <i className="bi bi-key"></i>Password
              </Link>
            </li>
          </ul>

          {/* Logout */}
          <div className="d-flex">
            <Link className="nav-link logout-link" to="#">
              <i className="bi bi-box-arrow-right"></i>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>


  {/* =========================================== */}
     <nav className="navbar admin-navbar">
  <div className="container-fluid">
    <ul className="navbar-nav flex-row admin-menu mx-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/admin/dashboard">
          Dashboard
        </Link>
      </li>

      <li className="nav-item ">
        <Link className="nav-link" to="/admin/manage-student">
          My Profile
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/admin/classes-subject">
          Classes 
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/admin/attendence">
          Attendence
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/admin/exams">
          Exams
        </Link>
      </li>

      <li className="nav-item ">
        <Link className="nav-link" to="/admin/fees">
          Result
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/admin/reports">
          Study Material
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/admin/settings">
          Notice
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/admin/settings">
          Leave
        </Link>
      </li>
    </ul>
  </div>
</nav>


</div>
  {/* ============================================== */}

    </>
  );
}

export default StudentNavbar;
