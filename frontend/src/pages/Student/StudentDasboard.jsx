import { useEffect, useState } from "react";
import {getShortProfileStudent} from "../../services/authService.js";
import "./css/StudentDashboard.css";

function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const fetchStudent = async () => {
    setLoading(true);
    setError("");

    const res = await getShortProfileStudent();

    if (!res?.success) {
      setError(res?.message || "Failed to load student data");
      setLoading(false);
      return;
    }

    setStudent(res?.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  if (loading) {
    return <div className="dash-loading">Loading student dashboard...</div>;
  }

  if (error) {
    return (
      <div className="dash-error">
        <h3>Complete The Profile First</h3>
        <p>{error}</p>
        <button onClick={fetchStudent}>Retry</button>
      </div>
    );
  }

  const user = student?.user;

  return (
    <div className="dash-container">
      <h2 className="dash-title">Student Dashboard</h2>

      <div className="dash-card">
        <div className="dash-left">
          <img
            className="dash-img"
            src={student?.userImage || "/default-user.png"}
            alt="student"
          />
        </div>

        <div className="dash-right">
          <div className="dash-row">
            <span className="label">Name:</span>
            <span className="value">{user?.name || "-"}</span>
          </div>

          <div className="dash-row">
            <span className="label">Email:</span>
            <span className="value">{user?.email || "-"}</span>
          </div>

          <div className="dash-row">
            <span className="label">Admission No:</span>
            <span className="value">{user?.campusId || "-"}</span>
          </div>

          <div className="dash-row">
            <span className="label">Father Mobile:</span>
            <span className="value">{student?.father?.phone || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;