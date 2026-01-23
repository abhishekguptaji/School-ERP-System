import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";

function AdminProfile() {
  return (
    <>
      <div className="d-flex flex-column vh-100">
       <AdminNavbar />
        <div className="flex-grow-1 overflow-auto">
          <h1>Admin Profile</h1>
           
        
        
        
        </div>
        <AdminFooter />
      </div>
    </>
  );
}

export default AdminProfile;
