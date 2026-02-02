import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ===== PUBLIC ===== */
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";

/* ===== AUTH ===== */
import ProtectedRoute from "./components/ProtectedRoute";

/* ===== ADMIN ===== */
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProfile from "./pages/Admin/AdminProfile";
import GrievancePanel from "./pages/Admin/GrievancePanel";
import RegisterStu from "./pages/Admin/RegisterStu";
import RegisterTeacher from "./pages/Admin/RegisterTeacher";
import Attendence from "./pages/Admin/Attendence";
import ClassXSection from "./pages/Admin/ClassXSection";
import ManageStudent from "./pages/Admin/ManageTeacher";
import ManageTeacher from  "./pages/Admin/ManageTeacher";
import Exams from "./pages/Admin/Exams";
import Fees from "./pages/Admin/Fees";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Reports";

/* ===== TEACHER ===== */
import TeacherLayout from "./pages/Teacher/TeacherLayout";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";

/* ===== STUDENT ===== */
import StudentLayout from "./pages/Student/StudentLayout";
import PasswordChange from "./pages/Student/PasswordChange";
import NoticeBoard from "./pages/Student/NoticeBoard";
import StudentDashboard from "./pages/Student/StudentDasboard";
import StuAttendence from "./pages/Student/StuAttendence";
import Assignment from "./pages/Student/Assignment";
import LeavePermission from "./pages/Student/LeavePermission";
import Results from "./pages/Student/Results";
import StudyMaterial from "./pages/Student/StudyMaterial";
import StuProfile from "./pages/Student/StuProfile";
import StuFee from "./pages/Student/StuFees";
import TimeTable from "./pages/Student/TimeTable";
import ApplyForm from "./pages/Student/ApplyForm";
import StuGrievance from "./pages/Student/StuGrievance";
import Library from "./pages/Student/Library";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* /admin → /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="admin-profile" element={<AdminProfile />} />
          <Route path="grievance-profile" element={<GrievancePanel />} />
          <Route path="add-student" element={<RegisterStu />} />
          <Route path="add-teacher" element={<RegisterTeacher />} />
          <Route path="manage-student" element={<ManageStudent />} />
          <Route path="manage-teacher" element={<ManageTeacher />} />
          <Route path="classes-subject" element={<ClassXSection />} />
          <Route path="attendence" element={<Attendence />} />
          <Route path="exams" element={<Exams />} />
          <Route path="fees" element={<Fees />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ================= TEACHER ================= */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<TeacherDashboard/>}/>
        

        
        </Route>  

        {/* ================ STUDENT ================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
        
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="notice-board" element={<NoticeBoard />} />
        <Route path="password-change" element={<PasswordChange />} />
        <Route path="assignment" element={<Assignment />} />
        <Route path="attendence" element={<StuAttendence />} />
        <Route path="leave-permission" element={<LeavePermission />} />
        <Route path="results" element={<Results />} />
        <Route path="study-material" element={<StudyMaterial />} />
        <Route path="stu-fee" element={<StuFee />} />
        <Route path="time-table" element={<TimeTable />} />
        <Route path="stu-profile"  element={<StuProfile/>} />
        <Route path="apply-form" element={<ApplyForm />}/>
        <Route path="stu-grievance" element={<StuGrievance />}/>
        <Route path="library" element={<Library />}/>
        </Route>  

      </Routes>
    </BrowserRouter>
  );
}

export default App;
