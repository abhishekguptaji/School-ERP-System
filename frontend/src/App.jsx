import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";

import LoginPage from "./components/LoginPage";

// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
// import StudentDashboard from "./pages/Student/StudentDasboard";

// import ProtectedRoute from "./components/ProtectedRoute";



function App() {
  return (
     <>
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='login' element={<LoginPage />}></Route>
      </Routes>
     </BrowserRouter>
     
     </>
    
  );
}

export default App;
