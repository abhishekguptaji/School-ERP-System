import "./css/TeacherNavbar.css";
import { Link,useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

function TeacherNavbar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <>
    <nav className="navbar navbar-expand-lg admin-navbar sticky-top">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <span className="school-brand">
            <Link className="nav-link " to="">
              Gupta Ji Public School
            </Link>
          </span>
          <span className="erp-brand ms-2">Teacher ERP</span>
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
              <Link className="nav-link" to="/teacher/tea-classes">
                My Class
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link " to="/teacher/tea-attendence">
               My Attendence
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link " to="/teacher/studentview">
              Student View
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/teacher/teacher-notice">
                Teacher Notice
              </Link>
            </li>

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
                <span className="ms-2">Teacher</span>
              </Link>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/teacher/my-profile">
                    My Profile
                  </Link>
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
        
{/* ================================================== */}
   <nav className="navbar admin-navbar">
  <div className="container-fluid">
    <ul className="navbar-nav flex-row admin-menu mx-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/teacher/dashboard">
          Dashboard
        </Link>
      </li>

      <li className="nav-item ">
        <Link className="nav-link" to="/teacher/my-profile">
          My Profile
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/teacher/tea-classes">
          Classes 
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/teacher/tea-attendence">
          Attendence
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/teacher/tea-exams">
          Exams
        </Link>
      </li>

      <li className="nav-item ">
        <Link className="nav-link" to="/teacher/tea-results">
          Result
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/teacher/tea-study-material">
          Study Material
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/teacher/tea-notices">
          Notice
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/teacher/tea-leave">
          Leave
        </Link>
      </li>
    </ul>
  </div>
</nav>


{/* ===================================================== */}

    </>
  );
}

export default TeacherNavbar;
