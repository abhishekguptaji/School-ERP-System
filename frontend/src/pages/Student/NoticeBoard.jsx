import "./css/NoticeBoard.css";

function NoticeBoard() {
  const notices = [
    {
      id: 1,
      title: "Mid Semester Exam",
      description: "Mid semester exams will start from 10th Feb 2026.",
      date: "05 Feb 2026",
    },
    {
      id: 2,
      title: "Holiday Notice",
      description: "College will remain closed on 26th Jan due to Republic Day.",
      date: "24 Jan 2026",
    },
    {
      id: 3,
      title: "Project Submission",
      description: "Final year project submission deadline is 15th Feb 2026.",
      date: "01 Feb 2026",
    },
  ];

  return (
    <div className="notice-board">
      <h2 className="notice-title">📢 Notice Board</h2>

      {notices.length === 0 ? (
        <p className="no-notice">No notices available</p>
      ) : (
        notices.map((notice) => (
          <div className="notice-card" key={notice.id}>
            <h4>{notice.title}</h4>
            <p>{notice.description}</p>
            <span className="notice-date">{notice.date}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default NoticeBoard;
