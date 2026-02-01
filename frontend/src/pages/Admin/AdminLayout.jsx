import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import "./css/AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-root">
      <AdminNavbar />

      <main className="admin-main">
        <Outlet />
      </main>

      <AdminFooter />
    </div>
  );
}

export default AdminLayout;
