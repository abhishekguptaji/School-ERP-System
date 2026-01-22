import "./css/Tab.css";

export default function Tabs() {
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
        <button className="tab-btn" onClick={() => handleTabClick(1)}>Profile</button>
        <button className="tab-btn" onClick={() => handleTabClick(2)}>Attendance</button>
        <button className="tab-btn" onClick={() => handleTabClick(3)}>Results</button>
        <button className="tab-btn" onClick={() => handleTabClick(4)}>Time Table</button>
        <button className="tab-btn" onClick={() => handleTabClick(5)}>Assignments</button>
        <button className="tab-btn" onClick={() => handleTabClick(6)}>Fees</button>
        <button className="tab-btn" onClick={() => handleTabClick(7)}>Notices</button>
        <button className="tab-btn" onClick={() => handleTabClick(8)}>Study Material</button>
        <button className="tab-btn" onClick={() => handleTabClick(9)}>Leave</button>
      </div>

      {/* TAB CONTENT */}
      <div className="tabs-body">
        <div className="tab-content show">Dashboard Overview</div>
        <div className="tab-content">Student Profile Information</div>
        <div className="tab-content">Attendance Details</div>
        <div className="tab-content">Exam Results</div>
        <div className="tab-content">Class Time Table</div>
        <div className="tab-content">Assignments & Submissions</div>
        <div className="tab-content">Fees & Payments</div>
        <div className="tab-content">School Notices & Updates</div>
        <div className="tab-content">Study Materials</div>
        <div className="tab-content">Leave Application</div>
      </div>
    </div>
  );
}
