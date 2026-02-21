import { useEffect, useMemo, useState } from "react";
import { getMyAttendance } from "../../services/authService.js";

function StuAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState("calendar");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await getMyAttendance();
      console.log(res.data);
      const apiData = res.data;

      setAttendanceData(apiData || []);
      setSummaryData({
        totalDays: res.totalDays,
        present: res.presentDays,
        absent: res.totalDays - res.presentDays || 0,
        percentage: res.attendancePercentage,
      });
    } catch (error) {
      console.error("Error fetching attendance", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "Present") return "success";
    if (status === "Absent") return "danger";
    return "secondary";
  };

  const statusLabel = (status) => status;
  
  const monthAttendance = useMemo(() => {
    return attendanceData.filter((a) => a.date.startsWith(month));
  }, [attendanceData, month]);

  // Map by date
  const attendanceMap = useMemo(() => {
    const map = {};
    monthAttendance.forEach((a) => (map[a.date] = a.status));
    return map;
  }, [monthAttendance]);

  // Calendar generation
  const calendarDays = useMemo(() => {
    const [year, monthNum] = month.split("-").map(Number);
    const firstDay = new Date(year, monthNum - 1, 1);
    const lastDay = new Date(year, monthNum, 0);

    const daysInMonth = lastDay.getDate();
    const startWeekDay = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startWeekDay; i++) days.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;

      days.push({
        day: d,
        date: dateStr,
        status: attendanceMap[dateStr] || "Holiday",
      });
    }

    return days;
  }, [month, attendanceMap]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
  <div className="min-vh-100 bg-light ">
    <div className="container px-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            My Attendance
          </h4>
          <small className="text-muted">
            View your monthly attendance report
          </small>
        </div>

        <div style={{ width: 180 }}>
          <input
            type="month"
            className="form-control form-control-sm"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 text-center py-3">
            <small className="text-muted">Total Days</small>
            <h5 className="fw-bold mt-1">{summaryData.totalDays || 0}</h5>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 text-center py-3">
            <small className="text-muted">Present</small>
            <h5 className="fw-bold text-success mt-1">
              {summaryData.present || 0}
            </h5>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 text-center py-3">
            <small className="text-muted">Absent</small>
            <h5 className="fw-bold text-danger mt-1">
              {summaryData.absent || 0}
            </h5>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 text-center py-3">
            <small className="text-muted">Attendance %</small>
            <h5 className="fw-bold text-primary mt-1">
              {summaryData.percentage || "0%"}
            </h5>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold mb-0">Attendance Details</h6>
          </div>

          {monthAttendance.length === 0 ? (
            <div className="text-center text-muted py-4">
              No attendance record found for this month.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {monthAttendance.map((a) => (
                    <tr key={a.date}>
                      <td>{a.date}</td>
                      <td>
                        <span
                          className={`badge text-bg-${statusColor(
                            a.status
                          )}`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  </div>
);
}

export default StuAttendance;