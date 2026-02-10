import "./css/AdminFooter.css";

function AdminFooter() {
  return (
    <footer className="admin-footer">
      <div className="container-fluid px-3">
        <div className="footer-wrap">
          {/* LEFT */}
          <div className="footer-left">
            <span className="footer-dot"></span>
            <span>
              © {new Date().getFullYear()}{" "}
              <strong>Gupta Ji Public School</strong>
            </span>
          </div>

          {/* CENTER */}
          <div className="footer-center">
            <span className="footer-badge">
              <i className="bi bi-grid-1x2-fill me-2"></i>
              Campus ERP v1.0.0
            </span>
          </div>

          {/* RIGHT */}
          <div className="footer-right">
            <i className="bi bi-code-slash me-2"></i>
            Designed & Developed by ERP Team
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
