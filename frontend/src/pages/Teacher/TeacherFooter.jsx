import React from "react";
import "./TeacherFooter.css";

function TeacherFooter() {
  return (
    <footer className="teacher-footer">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span>
          © {new Date().getFullYear()} <strong>Green Valley School</strong>
        </span>
        <span className="footer-center">
          Teacher Panel | Campus ERP
        </span>
        <span>
          Designed & Developed by ERP Team
        </span>
      </div>
    </footer>
  );
}

export default TeacherFooter;
