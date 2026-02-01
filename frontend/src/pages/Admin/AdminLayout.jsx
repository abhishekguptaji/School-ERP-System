import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import AdminTabs from "./AdminTabs";
import "./css/AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-root">
      <AdminNavbar />

      {/* AREA BETWEEN NAVBAR & FOOTER */}
      <div className="admin-body">
        {/* LEFT FIXED TABS */}
        <AdminTabs />

        {/* RIGHT SCROLLABLE CONTENT */}
        <div className="admin-content">
          {/* yahan tumhara data/pages aayega */}
        </div>
      </div>

      <AdminFooter />
    </div>
  );
}

export default AdminLayout;
