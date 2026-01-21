import TeacherNavbar from "./TeacherNavbar.jsx";
import TeacherFooter from "./TeacherFooter.jsx";

function TeacherDashboard() {
  return (
    <>
      <TeacherNavbar />

      <main className="min-h-screen p-6 bg-gray-100 text-center">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to the Teacher Panel
        </p>
      </main>

      <TeacherFooter />
    </>
  );
}

export default TeacherDashboard;
