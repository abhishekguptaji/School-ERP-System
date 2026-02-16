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
  SubjectTeacher,
  ClassXSection,
  FindStudentsAll,
  ManageTeacher,
  AdTimeTable,
  Fees,
  Reports,
  Settings,
  AdminLibrary,
  NoticePanel,
  FindTeacherAll
} from "./AdminImports";

/* ===== TEACHER ===== */
import {
  TAssignment,
  TAttendence,
  TAttendenceReport,
  TDashboard,
  TGrievances,
  TLeave,
  TMarksUploads,
  TNotices,
  TPasswordChange,
  TProfile,
  TResultSheet,
  TStudents,
  TStudyMaterial,
  TTimeTable,
  TeacherLayout
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
          <Route path="find-students-all" element={<FindStudentsAll />} />
          <Route path="manage-teacher" element={<ManageTeacher />} />
          <Route path="classes-subject" element={<ClassXSection />} />
          <Route path="subject-teacher" element={<SubjectTeacher />} />
          <Route path="admin-time-table" element={<AdTimeTable />} />
          <Route path="fees" element={<Fees />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notices-panel" element={<NoticePanel />}/>
          <Route path="settings" element={<Settings />} />
          <Route path="library" element={<AdminLibrary />}/>
          <Route path="find-teacher-all" element={<FindTeacherAll />}/>
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
          <Route path="dashboard" element={<TDashboard />} />
          <Route path="assignments" element={<TAssignment />} />
          <Route path="attendance" element={<TAttendence />} />
          <Route path="attendance/report" element={<TAttendenceReport />} />
          <Route path="grievances" element={<TGrievances />} />
          <Route path="leave" element={<TLeave />} />
          <Route path="marks" element={<TMarksUploads />} />
          <Route path="notices" element={<TNotices />} />
          <Route path="profile" element={<TProfile />} />
          <Route path="students" element={<TStudents />} />
          <Route path="results" element={<TResultSheet />} />
          <Route path="material" element={<TStudyMaterial />} />
          <Route path="timetable" element={<TTimeTable />} />
          <Route path="change-password" element={<  TPasswordChange/>} />
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
          <Route path="password-change" element={<TPasswordChange />} />
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
