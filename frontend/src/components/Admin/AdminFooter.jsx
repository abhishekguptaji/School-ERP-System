import React from "react";
import "./AdminFooter.css";

function AdminFooter() {
  return (
    <footer className="admin-footer">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span>
          © {new Date().getFullYear()} <strong>Green Valley School</strong>
        </span>
        <span className="footer-center">
          Campus ERP v1.0.0
        </span>
        <span>
          Designed & Developed by ERP Team
        </span>
      </div>
    </footer>
  );
}

export default AdminFooter;
