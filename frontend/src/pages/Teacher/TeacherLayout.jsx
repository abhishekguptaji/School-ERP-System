import TeacherNavbar from "./TeacherNavbar.jsx";
import TeacherFooter from "./TeacherFooter.jsx";
import {Outlet} from "react-router-dom";
import "./css/TeacherLayout.css";
function TeacherLayout() {
  return (
    <> 
      <div>
      <TeacherNavbar className="teacher-root" />

      <main className="teacher-main">
        <Outlet />
      </main>

      <TeacherFooter />

      </div>
    </>

  );
}

export default TeacherLayout;
