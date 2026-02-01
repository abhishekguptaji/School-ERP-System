import { Outlet } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentFooter from "./StudentFooter";
import "./css/StudentLayout.css";

function StudentLayout() {
  return (
    <div className="page">
      <StudentNavbar />

      {/* SCROLLABLE CONTENT */}
      <main className="content">
        <Outlet />
      </main>

      <footer className="footer">
      <StudentFooter />
      </footer>
    </div>
  );
}

export default StudentLayout;
