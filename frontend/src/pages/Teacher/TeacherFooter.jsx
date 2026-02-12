import "./css/TeacherFooter.css";

function TeacherFooter() {
  return (
    <footer className="teacher-footer">
      <div className="container-fluid">
        <div className="teacher-footer-inner">
          <span className="teacher-footer-left">
            © {new Date().getFullYear()} <strong>Green Valley School</strong>
          </span>

          <span className="teacher-footer-center">
            Teacher Panel | Campus ERP
          </span>

          <span className="teacher-footer-right">
            Designed & Developed by ERP Team
          </span>
        </div>
      </div>
    </footer>
  );
}

export default TeacherFooter;
