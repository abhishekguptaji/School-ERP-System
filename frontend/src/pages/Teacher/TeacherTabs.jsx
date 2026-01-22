import "./Tabs.css";

export default function TeacherTabs() {
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
        <button className="tab-btn active" onClick={() => handleTabClick(0)}>Dashboard</button>
        <button className="tab-btn" onClick={() => handleTabClick(1)}>My Profile</button>
        <button className="tab-btn" onClick={() => handleTabClick(2)}>Classes</button>
        <button className="tab-btn" onClick={() => handleTabClick(3)}>Attendance</button>
        <button className="tab-btn" onClick={() => handleTabClick(4)}>Assignments</button>
        <button className="tab-btn" onClick={() => handleTabClick(5)}>Exams</button>
        <button className="tab-btn" onClick={() => handleTabClick(6)}>Results</button>
        <button className="tab-btn" onClick={() => handleTabClick(7)}>Study Material</button>
        <button className="tab-btn" onClick={() => handleTabClick(8)}>Notices</button>
        <button className="tab-btn" onClick={() => handleTabClick(9)}>Leave</button>
      </div>

      {/* TAB CONTENT */}
      <div className="tabs-body">
        <div className="tab-content show">Teacher Dashboard Overview</div>
        <div className="tab-content">Teacher Profile Information</div>
        <div className="tab-content">Assigned Classes & Subjects</div>
        <div className="tab-content">Mark / Update Attendance</div>
        <div className="tab-content">Create & Check Assignments</div>
        <div className="tab-content">Manage Exams</div>
        <div className="tab-content">Upload Student Results</div>
        <div className="tab-content">Upload Study Materials</div>
        <div className="tab-content">School & Class Notices</div>
        <div className="tab-content">Leave Application</div>
      </div>
    </div>
  );
}
