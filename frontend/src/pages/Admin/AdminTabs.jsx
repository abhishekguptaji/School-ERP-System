import ClassXSection from "./ClassXSection";
import "./css/Tab.css";
import DashboardInner from "./DashboardInner";
import ManageStudent from "./ManageStudent";
import ManageTeacher from "./ManageTeacher";

export default function AdminTabs() {
  const handleTabClick = (index) => {
    const buttons = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    buttons.forEach((btn) => btn.classList.remove("active"));
    contents.forEach((content) => content.classList.remove("show"));

    buttons[index].classList.add("active");
    contents[index].classList.add("show");
  };

  return (
    <div className="tabs-wrapper">
      {/* TAB HEADER */}
      <div className="tabs-header">
        <button className="tab-btn active" onClick={() => handleTabClick(0)}>
          Dashboard
        </button>
        <button className="tab-btn" onClick={() => handleTabClick(1)}>
          Manage Students
        </button>
        <button className="tab-btn" onClick={() => handleTabClick(2)}>
          Manage Teachers
        </button>
        <button className="tab-btn" onClick={() => handleTabClick(3)}>
          Classes & Subjects 
        </button>
        <button className="tab-btn" onClick={() => handleTabClick(4)}>
           Attendance
        </button>
        <button className="tab-btn" onClick={() => handleTabClick(5)}>
           Exams
        </button>
        <button className="tab-btn" onClick={() => handleTabClick(6)}>
         Fees
        </button>
        <button className="tab-btn" onClick={() => handleTabClick(7)}>
         Reports   
        </button>
        <button className="tab-btn" onClick={() => handleTabClick(8)}>
          Settings
        </button>
        {/* <button className="tab-btn" onClick={() => handleTabClick(9)}>
          A
        </button> */}
      </div>

      {/* TAB CONTENT */}
      <div className="tabs-body">
        <div className="tab-content show">
          <DashboardInner />
        </div>
        <div className="tab-content">
          <ManageStudent />
        </div>
        <div className="tab-content">
          <ManageTeacher />
        </div>
        <div className="tab-content">
          <ClassXSection /> 
        </div>
        <div className="tab-content">
        Subject Management
        </div>
        <div className="tab-content">
          Attendance Monitoring
        </div>
        <div className="tab-content">
         Exam Management
        </div>
        <div className="tab-content">
          Fees & Payments
        </div>
        <div className="tab-content">
          Reports & Analytics
        </div>
        <div className="tab-content">
          System Settings
        </div>
      </div>
    </div>
  );
}
