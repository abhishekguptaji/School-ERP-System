import StudentNavbar from "./StudentNavbar";
import StudentFooter from "./StudentFooter";
import Tab from "./Tab";

function StudentDashboard() {
  return(
    <> 
     <StudentNavbar />
      <main className="min-h-screen p-6 bg-gray-100 text-center">
        <Tab />
      </main>
      <StudentFooter />
    </>
  )
}

export default  StudentDashboard;