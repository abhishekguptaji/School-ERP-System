import { useMemo, useState } from "react";

function TimeTable() {
  // Demo Student Info (API se aayega later)
  const studentInfo = {
    name: "Abhishek",
    className: "B.Tech (Sem 5)",
    section: "A",
    rollNo: "100",
  };

  // Demo Timetable Data (API se replace karna)
  const timetable = [
    {
      id: 1,
      day: "Monday",
      period: "1",
      time: "09:00 - 10:00",
      subject: "Compiler Design",
      teacher: "Mr. Sharma",
      room: "Lab-2",
    },
    {
      id: 2,
      day: "Monday",
      period: "2",
      time: "10:00 - 11:00",
      subject: "DBMS",
      teacher: "Ms. Priya",
      room: "Room-12",
    },
    {
      id: 3,
      day: "Monday",
      period: "3",
      time: "11:00 - 12:00",
      subject: "Operating System",
      teacher: "Mr. Singh",
      room: "Room-10",
    },
    {
      id: 4,
      day: "Tuesday",
      period: "1",
      time: "09:00 - 10:00",
      subject: "DBMS",
      teacher: "Ms. Priya",
      room: "Room-12",
    },
    {
      id: 5,
      day: "Tuesday",
      period: "2",
      time: "10:00 - 11:00",
      subject: "Compiler Design",
      teacher: "Mr. Sharma",
      room: "Lab-2",
    },
    {
      id: 6,
      day: "Wednesday",
      period: "1",
      time: "09:00 - 10:00",
      subject: "Operating System",
      teacher: "Mr. Singh",
      room: "Room-10",
    },
    {
      id: 7,
      day: "Thursday",
      period: "1",
      time: "09:00 - 10:00",
      subject: "Compiler Design",
      teacher: "Mr. Sharma",
      room: "Lab-2",
    },
    {
      id: 8,
      day: "Friday",
      period: "1",
      time: "09:00 - 10:00",
      subject: "DBMS",
      teacher: "Ms. Priya",
      room: "Room-12",
    },
    {
      id: 9,
      day: "Saturday",
      period: "1",
      time: "09:00 - 10:00",
      subject: "Seminar / Practical",
      teacher: "Department",
      room: "Hall",
    },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [activeDay, setActiveDay] = useState("Monday");
  const [search, setSearch] = useState("");
  const [selectedLecture, setSelectedLecture] = useState(null);

  // Filter timetable for active day + search
  const dayLectures = useMemo(() => {
    return timetable
      .filter((t) => t.day === activeDay)
      .filter((t) => {
        const q = search.toLowerCase();
        return (
          t.subject.toLowerCase().includes(q) ||
          t.teacher.toLowerCase().includes(q) ||
          t.room.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => Number(a.period) - Number(b.period));
  }, [timetable, activeDay, search]);

  // Weekly table view
  const weeklyView = useMemo(() => {
    // Group by day
    const map = {};
    for (const d of days) map[d] = [];

    timetable.forEach((t) => {
      map[t.day].push(t);
    });

    // sort each day
    days.forEach((d) => map[d].sort((a, b) => Number(a.period) - Number(b.period)));

    return map;
  }, [timetable]);

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              <i className="bi bi-calendar-week-fill text-primary me-2"></i>
              Time Table
            </h3>
            <div className="text-muted">
              Weekly schedule for{" "}
              <b>
                {studentInfo.className} ({studentInfo.section})
              </b>
            </div>
          </div>

          {/* Student mini card */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body py-3 px-4">
              <div className="fw-bold">{studentInfo.name}</div>
              <div className="text-muted small">
                Roll No: <b>{studentInfo.rollNo}</b>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH + VIEW */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-7">
                <label className="form-label fw-semibold">Search Lecture</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by subject, teacher or room..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-5">
                <label className="form-label fw-semibold">Selected Day</label>
                <div className="d-flex flex-wrap gap-2">
                  {days.map((d) => (
                    <button
                      key={d}
                      className={`btn rounded-pill px-3 ${
                        activeDay === d ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => setActiveDay(d)}
                      type="button"
                    >
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="alert alert-light border rounded-4 small mt-3 mb-0">
              <i className="bi bi-info-circle me-2"></i>
              Click on a lecture card to view full details.
            </div>
          </div>
        </div>

        {/* DAY VIEW CARDS */}
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-clock-history text-primary me-2"></i>
                    {activeDay} Schedule
                  </h5>
                  <span className="badge text-bg-light border text-dark rounded-pill">
                    {dayLectures.length} periods
                  </span>
                </div>

                {dayLectures.length === 0 ? (
                  <div className="alert alert-info rounded-4 border mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    No lectures found for this day.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {dayLectures.map((lec) => (
                      <div
                        key={lec.id}
                        className="border rounded-4 p-3 bg-white"
                        role="button"
                        onClick={() => setSelectedLecture(lec)}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div>
                            <div className="fw-bold">{lec.subject}</div>
                            <div className="text-muted small mt-1">
                              <i className="bi bi-person me-2"></i>
                              {lec.teacher}
                            </div>
                            <div className="text-muted small">
                              <i className="bi bi-geo-alt me-2"></i>
                              {lec.room}
                            </div>
                          </div>

                          <div className="text-end">
                            <span className="badge text-bg-primary rounded-pill">
                              Period {lec.period}
                            </span>
                            <div className="text-muted small mt-2">
                              <i className="bi bi-clock me-2"></i>
                              {lec.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* WEEKLY VIEW TABLE */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-grid-3x3-gap-fill text-primary me-2"></i>
                    Weekly Overview
                  </h5>

                  <span className="badge text-bg-light border text-dark rounded-pill">
                    Mon - Sat
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle table-hover">
                    <thead>
                      <tr className="text-muted">
                        <th style={{ width: 120 }}>Day</th>
                        <th>Periods</th>
                      </tr>
                    </thead>
                    <tbody>
                      {days.map((d) => (
                        <tr key={d}>
                          <td className="fw-semibold">{d}</td>
                          <td>
                            {weeklyView[d].length === 0 ? (
                              <span className="text-muted">No lectures</span>
                            ) : (
                              <div className="d-flex flex-wrap gap-2">
                                {weeklyView[d].map((lec) => (
                                  <button
                                    key={lec.id}
                                    type="button"
                                    className="btn btn-outline-primary btn-sm rounded-pill"
                                    onClick={() => setSelectedLecture(lec)}
                                  >
                                    {lec.period}. {lec.subject}
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="small text-muted mt-2">
                  <i className="bi bi-lightbulb me-2"></i>
                  Tip: Weekly overview buttons open lecture details.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedLecture && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {selectedLecture.subject}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedLecture(null)}
                ></button>
              </div>

              <div className="modal-body pt-2">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge text-bg-light border text-dark rounded-pill">
                    <i className="bi bi-calendar-event me-1"></i>
                    {selectedLecture.day}
                  </span>

                  <span className="badge text-bg-primary rounded-pill">
                    Period {selectedLecture.period}
                  </span>

                  <span className="badge text-bg-light border text-dark rounded-pill">
                    <i className="bi bi-clock me-1"></i>
                    {selectedLecture.time}
                  </span>
                </div>

                <div className="p-3 bg-light rounded-4 mb-3">
                  <div className="fw-semibold mb-1">Teacher</div>
                  <div className="text-muted">{selectedLecture.teacher}</div>
                </div>

                <div className="p-3 border rounded-4">
                  <div className="fw-semibold mb-1">Room</div>
                  <div className="text-muted">{selectedLecture.room}</div>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary rounded-3"
                  onClick={() => setSelectedLecture(null)}
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

export default TimeTable;
