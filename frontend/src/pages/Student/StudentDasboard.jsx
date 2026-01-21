import StudentNavbar from "./StudentNavbar";
import StudentFooter from "./StudentFooter";


function StudentDashboard() {
  return(
    <> 
     <StudentNavbar />
      <main className="min-h-screen p-6 bg-gray-100 text-center">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to the Student Panel
        </p>
      </main>
      <StudentFooter />
    </>
  )
}

export default  StudentDashboard;