import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import AdminTabs from "./AdminTabs";

function AdminDashboard() {
  return(
    <> 
     <AdminNavbar />
      <main className="min-h-screen p-6 bg-gray-100 text-center">
        <AdminTabs />
      </main>
      <AdminFooter />
    </>
  )
}

export default  AdminDashboard;