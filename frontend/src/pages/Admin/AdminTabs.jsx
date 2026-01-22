import "./css/Tab.css";

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
        <button className="tab-btn active" onClick={() => handleTabClick(0)}>Dashboard</button>
        <button className="tab-btn" onClick={() => handleTabClick(1)}>Students</button>
        <button className="tab-btn" onClick={() => handleTabClick(2)}>Teachers</button>
        <button className="tab-btn" onClick={() => handleTabClick(3)}>Classes</button>
        <button className="tab-btn" onClick={() => handleTabClick(4)}>Subjects</button>
        <button className="tab-btn" onClick={() => handleTabClick(5)}>Attendance</button>
        <button className="tab-btn" onClick={() => handleTabClick(6)}>Exams</button>
        <button className="tab-btn" onClick={() => handleTabClick(7)}>Fees</button>
        <button className="tab-btn" onClick={() => handleTabClick(8)}>Reports</button>
        <button className="tab-btn" onClick={() => handleTabClick(9)}>Settings</button>
      </div>

      {/* TAB CONTENT */}
      <div className="tabs-body">
        <div className="tab-content show">Admin Dashboard Overview</div>
        <div className="tab-content">Manage Students</div>
        <div className="tab-content">Manage Teachers</div>
        <div className="tab-content">Class & Section Management</div>
        <div className="tab-content">Subject Management</div>
        <div className="tab-content">Attendance Monitoring</div>
        <div className="tab-content">Exam Management</div>
        <div className="tab-content">Fees & Payments</div>
        <div className="tab-content">Reports & Analytics</div>
        <div className="tab-content">System Settings</div>
      </div>
    </div>
  );
}
