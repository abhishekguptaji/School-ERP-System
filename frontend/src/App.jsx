import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ===== PUBLIC ===== */
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";

/* ===== AUTH ===== */
import ProtectedRoute from "./components/ProtectedRoute";

/* ===== ADMIN ===== */
import {
  AdminLayout,
  AdminDashboard,
  AdminProfile,
  GrievancePanel,
  RegisterStu,
  RegisterTeacher,
  Attendence,
  ClassXSection,
  ManageStudent,
  ManageTeacher,
  Exams,
  Fees,
  Reports,
  Settings,
} from "./AdminImports";

/* ===== TEACHER ===== */
import {
  TeacherLayout,
  TeacherDashboard,
  TeaAttendence,
  TeaNotices,
  TeaExams,
  TeaLeave,
  TeaResults,
  TeaStudyMaterial,
  StudentView,
  TeaClasses,
  TeacherProfile,
  TeacherNotice,
} from "./TeacherImports";

/* ===== STUDENT ===== */
import {
  StudentLayout,
  PasswordChange,
  NoticeBoard,
  StudentDashboard,
  StuAttendence,
  Assignment,
  LeavePermission,
  Results,
  StudyMaterial,
  StuProfile,
  StuFee,
  TimeTable,
  ApplyForm,
  StuGrievance,
  Library,
} from "./StudentImports";

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
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="my-profile" element={<TeacherProfile />} />
          <Route path="teacher-notice" element={<TeacherNotice />} />
          <Route path="studentview" element={<StudentView />} />
          <Route path="tea-attendence" element={<TeaAttendence />} />
          <Route path="tea-notices" element={<TeaNotices />} />
          <Route path="tea-classes" element={<TeaClasses />} />
          <Route path="tea-exams" element={<TeaExams />} />
          <Route path="tea-leave" element={<TeaLeave />} />
          <Route path="tea-notices" element={<TeaNotices />} />
          <Route path="tea-results" element={<TeaResults />} />
          <Route path="tea-study-material" element={<TeaStudyMaterial />} />
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
          <Route path="stu-profile" element={<StuProfile />} />
          <Route path="apply-form" element={<ApplyForm />} />
          <Route path="stu-grievance" element={<StuGrievance />} />
          <Route path="library" element={<Library />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
