import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";


function AdminDashboard() {
  return(
    <> 
     <AdminNavbar />
      <main className="min-h-screen p-6 bg-gray-100 text-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to the Admin Panel
        </p>
      </main>
      <AdminFooter />
    </>
  )
}

export default  AdminDashboard;