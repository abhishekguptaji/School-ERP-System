import { useMemo, useState } from "react";

function StuAttendance() {
  // Demo student info (API se aayega)
  const studentInfo = {
    name: "Abhishek",
    rollNo: "100",
    className: "B.Tech (Sem 5)",
    section: "A",
  };

  // Demo Attendance Data (API se replace)
  // status: present | absent | late | holiday
  const attendanceData = [
    { date: "2026-02-01", status: "holiday" },
    { date: "2026-02-02", status: "present" },
    { date: "2026-02-03", status: "present" },
    { date: "2026-02-04", status: "late" },
    { date: "2026-02-05", status: "present" },
    { date: "2026-02-06", status: "absent" },
    { date: "2026-02-07", status: "holiday" },
    { date: "2026-02-08", status: "holiday" },
    { date: "2026-02-09", status: "present" },
    { date: "2026-02-10", status: "present" },
    { date: "2026-02-11", status: "present" },
    { date: "2026-02-12", status: "late" },
    { date: "2026-02-13", status: "present" },
    { date: "2026-02-14", status: "holiday" },
    { date: "2026-02-15", status: "holiday" },
    { date: "2026-02-16", status: "absent" },
    { date: "2026-02-17", status: "present" },
    { date: "2026-02-18", status: "present" },
    { date: "2026-02-19", status: "present" },
    { date: "2026-02-20", status: "present" },
    { date: "2026-02-21", status: "holiday" },
    { date: "2026-02-22", status: "holiday" },
    { date: "2026-02-23", status: "present" },
    { date: "2026-02-24", status: "present" },
    { date: "2026-02-25", status: "present" },
    { date: "2026-02-26", status: "late" },
    { date: "2026-02-27", status: "present" },
    { date: "2026-02-28", status: "holiday" },
  ];

  // Month selector (YYYY-MM)
  const [month, setMonth] = useState("2026-02");
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState("calendar"); // calendar | table

  const statusColor = (status) => {
    if (status === "present") return "success";
    if (status === "absent") return "danger";
    if (status === "late") return "warning";
    return "secondary"; // holiday
  };

  const statusLabel = (status) => {
    if (status === "present") return "Present";
    if (status === "absent") return "Absent";
    if (status === "late") return "Late";
    return "Holiday";
  };

  // Filter attendance for selected month
  const monthAttendance = useMemo(() => {
    return attendanceData.filter((a) => a.date.startsWith(month));
  }, [attendanceData, month]);

  // Map by date for quick access
  const attendanceMap = useMemo(() => {
    const map = {};
    monthAttendance.forEach((a) => (map[a.date] = a.status));
    return map;
  }, [monthAttendance]);

  // Summary
  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let holiday = 0;

    monthAttendance.forEach((a) => {
      if (a.status === "present") present++;
      else if (a.status === "absent") absent++;
      else if (a.status === "late") late++;
      else holiday++;
    });

    const workingDays = present + absent + late;
    const percentage =
      workingDays === 0 ? 0 : Math.round(((present + late) / workingDays) * 100);

    return { present, absent, late, holiday, workingDays, percentage };
  }, [monthAttendance]);

  // Calendar generation
  const calendarDays = useMemo(() => {
    const [year, monthNum] = month.split("-").map(Number);
    const firstDay = new Date(year, monthNum - 1, 1);
    const lastDay = new Date(year, monthNum, 0);

    const daysInMonth = lastDay.getDate();
    const startWeekDay = firstDay.getDay(); // 0 Sunday

    const days = [];

    // empty cells before first day
    for (let i = 0; i < startWeekDay; i++) days.push(null);

    // actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;

      days.push({
        day: d,
        date: dateStr,
        status: attendanceMap[dateStr] || "holiday",
      });
    }

    return days;
  }, [month, attendanceMap]);

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              <i className="bi bi-calendar-check-fill text-primary me-2"></i>
              Attendance
            </h3>
            <div className="text-muted">
              Track your monthly attendance with summary and calendar view
            </div>
          </div>

          {/* Student mini */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body py-3 px-4">
              <div className="fw-bold">{studentInfo.name}</div>
              <div className="text-muted small">
                Roll No: <b>{studentInfo.rollNo}</b>
              </div>
              <div className="text-muted small">
                {studentInfo.className} ({studentInfo.section})
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Select Month</label>
                <input
                  type="month"
                  className="form-control"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">View Mode</label>
                <select
                  className="form-select"
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                >
                  <option value="calendar">Calendar View</option>
                  <option value="table">Table View</option>
                </select>
              </div>

              <div className="col-md-4">
                <button className="btn btn-outline-primary w-100 rounded-3">
                  <i className="bi bi-download me-2"></i>
                  Download Report (PDF)
                </button>
              </div>
            </div>

            <div className="alert alert-light border rounded-4 small mt-3 mb-0">
              <i className="bi bi-info-circle me-2"></i>
              Late is counted as Present for attendance percentage.
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="text-muted small">Present</div>
                <div className="fw-bold fs-3 text-success">
                  {summary.present}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="text-muted small">Absent</div>
                <div className="fw-bold fs-3 text-danger">{summary.absent}</div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="text-muted small">Late</div>
                <div className="fw-bold fs-3 text-warning">{summary.late}</div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="text-muted small">Percentage</div>
                <div className="fw-bold fs-3 text-primary">
                  {summary.percentage}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN VIEW */}
        {viewMode === "calendar" ? (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-grid-3x3-gap-fill text-primary me-2"></i>
                  Calendar View
                </h5>

                <div className="d-flex flex-wrap gap-2">
                  <span className="badge text-bg-success rounded-pill">
                    Present
                  </span>
                  <span className="badge text-bg-warning rounded-pill">
                    Late
                  </span>
                  <span className="badge text-bg-danger rounded-pill">
                    Absent
                  </span>
                  <span className="badge text-bg-secondary rounded-pill">
                    Holiday
                  </span>
                </div>
              </div>

              {/* Weekdays */}
              <div className="row g-2 mb-2 text-center text-muted fw-semibold">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="col">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="row g-2">
                {calendarDays.map((d, idx) => (
                  <div key={idx} className="col-12 col-sm-6 col-md-3 col-lg-2">
                    {d ? (
                      <button
                        className={`w-100 border-0 rounded-4 p-3 text-start bg-${statusColor(
                          d.status
                        )} bg-opacity-10`}
                        onClick={() => setSelectedDay(d)}
                        type="button"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="fw-bold">{d.day}</div>
                          <span
                            className={`badge text-bg-${statusColor(
                              d.status
                            )} rounded-pill`}
                          >
                            {statusLabel(d.status)}
                          </span>
                        </div>
                        <div className="text-muted small mt-2">{d.date}</div>
                      </button>
                    ) : (
                      <div className="rounded-4 p-3 bg-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-table text-primary me-2"></i>
                  Table View
                </h5>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr className="text-muted">
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthAttendance.map((a) => (
                      <tr key={a.date}>
                        <td className="fw-semibold">{a.date}</td>
                        <td>
                          <span
                            className={`badge text-bg-${statusColor(
                              a.status
                            )} rounded-pill`}
                          >
                            {statusLabel(a.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedDay && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Attendance Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedDay(null)}
                ></button>
              </div>

              <div className="modal-body pt-2">
                <div className="p-3 bg-light rounded-4">
                  <div className="text-muted small">Date</div>
                  <div className="fw-bold fs-5">{selectedDay.date}</div>

                  <div className="mt-3">
                    <span
                      className={`badge text-bg-${statusColor(
                        selectedDay.status
                      )} rounded-pill px-3 py-2`}
                    >
                      {statusLabel(selectedDay.status)}
                    </span>
                  </div>
                </div>

                <div className="alert alert-light border rounded-4 small mt-3 mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Attendance status is based on school record.
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary rounded-3"
                  onClick={() => setSelectedDay(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StuAttendance;
