import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";

import LoginPage from "./components/LoginPage";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import StudentDashboard from "./pages/Student/StudentDasboard";

import ProtectedRoute from "./components/ProtectedRoute";
import RegisterStu from "./pages/Admin/RegisterStu";
import RegisterTeacher from "./pages/Admin/RegisterTeacher";
import AdminProfile from "./pages/Admin/AdminProfile";
import GrievancePanel from "./pages/Admin/GrievancePanel";
import PasswordChange from "./pages/Student/PasswordChange";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ADMIN */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
               
            <Route
            path="/admin/admin-profile"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProfile />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/admin/grievance-profile"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <GrievancePanel />
              </ProtectedRoute>
            }
          ></Route>





          <Route
            path="/admin/add-student"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <RegisterStu />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/admin/add-teacher"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <RegisterTeacher />
              </ProtectedRoute>
            }
          ></Route>

          {/* TEACHER */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* STUDENT */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          

          <Route
           path="/student/password-change"
           element={
            <ProtectedRoute allowedRoles={["student"]}>
              <PasswordChange />
            </ProtectedRoute>
           }>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
