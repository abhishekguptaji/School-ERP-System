import { Outlet } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentFooter from "./StudentFooter";
import "./css/StudentLayout.css";

function StudentLayout() {
  return (
    <div className="studentLayout">
      {/* FIXED NAVBAR */}
      <header className="studentHeader">
        <StudentNavbar />
      </header>

      {/* SCROLLABLE CONTENT */}
      <main className="studentMain">
        <Outlet />
      </main>

      {/* FIXED FOOTER */}
      <footer className="studentFooterFixed">
        <StudentFooter />
      </footer>
    </div>
  );
}

export default StudentLayout;