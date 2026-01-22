import TeacherNavbar from "./TeacherNavbar.jsx";
import TeacherFooter from "./TeacherFooter.jsx";
import TeacherTabs from "./TeacherTabs.jsx";

function TeacherDashboard() {
  return (
    <>
      <TeacherNavbar />

      <main className="min-h-screen p-6 bg-gray-100 text-center">
        <TeacherTabs />
      </main>

      <TeacherFooter />
    </>
  );
}

export default TeacherDashboard;
