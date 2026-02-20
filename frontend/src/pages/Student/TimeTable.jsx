import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getMyClassTimeTableStudent } from "../../services/authService.js";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PERIODS = [
  { no: 1, time: "09:00 - 09:40" },
  { no: 2, time: "09:40 - 10:20" },
  { no: 3, time: "10:20 - 11:00" },
  { no: 4, time: "11:00 - 11:40" },
  { no: 5, time: "11:40 - 12:20" },
  { no: 6, time: "12:20 - 01:00" },
];

const makeKey = (day, periodNo) => `${day}_${periodNo}`;

function TimeTable() {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeTable();
  }, []);

  const fetchTimeTable = async () => {
    try {
      setLoading(true);

      const res = await getMyClassTimeTableStudent();
      const data = res.timetable || [];

      if (!data.length) {
        Swal.fire({
          icon: "warning",
          title: "Timetable Not Available",
          text: "Complete your profile. Timetable not available. Contact class teacher.",
        });
        setTimetable({});
        return;
      }

      const map = {};
      for (const row of data) {
        const key = makeKey(row.day, row.periodNo);
        map[key] = {
          subjectName: row.subjectId?.name || "N/A",
          teacherName: row.teacherId?.user?.name || "N/A",
        };
      }

      setTimetable(map);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to load timetable",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2 text-muted">Loading timetable...</p>
      </div>
    );

  return (
    <div className="container-fulid px-4">
      <h3 className="fw-bold text-dark mb-3 text-center">
        My Class Time Table
      </h3>
      

      <div className="table-responsive shadow-sm">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>Period</th>
              <th>Time</th>
              {DAYS.map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {PERIODS.map((p) => (
              <tr key={p.no}>
                <td className="fw-bold">#{p.no}</td>
                <td className="text-muted">{p.time}</td>

                {DAYS.map((day) => {
                  const entry = timetable[makeKey(day, p.no)];

                  return (
                    <td key={day}>
                      {entry ? (
                        <>
                          <div className="fw-semibold">
                            {entry.subjectName.split("(")[0].trim()}
                          </div>
                          <div className="small text-muted">
                            {entry.teacherName} 
                          </div>
                        </>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TimeTable;