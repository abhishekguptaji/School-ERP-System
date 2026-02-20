import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getMyTimeTableTeacher } from "../../services/teacherService.js";

const daysOrder = [
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

function TimeTable() {
  const [matrix, setMatrix] = useState({});
  const [maxPeriod, setMaxPeriod] = useState(PERIODS.length);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTimeTable();
  }, []);

  const fetchTimeTable = async () => {
    try {
      setLoading(true);

      const res = await getMyTimeTableTeacher();
      const data = res.timetable;

      if (!data.length) {
        Swal.fire(
          "No Timetable Assigned",
          "You do not have any assigned periods yet. Contact admin.",
          "info"
        );
        setMatrix({});
        setMaxPeriod(PERIODS.length);
        return;
      }

      const highestPeriod =
        Math.max(...data.map((d) => d.periodNo));

      setMaxPeriod(highestPeriod);

      const tableMatrix = {};

      data.forEach((item) => {
        if (!tableMatrix[item.periodNo]) {
          tableMatrix[item.periodNo] = {};
        }
        tableMatrix[item.periodNo][item.day] = item;
      });

      setMatrix(tableMatrix);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <h3 className="text-center mt-4">Loading timetable...</h3>;

  if (error)
    return <h3 className="text-danger text-center mt-4">{error}</h3>;

  return (
    <div className="container-fulid px-4">
      <div className="card shadow-lg border-0">
        <div className="card-header  text-dark text-center">
          <h4 className="mb-3">My Weekly Teaching Time Table</h4>
        </div>

        <div className="card-body p-0 table-responsive">
          <table className="table table-bordered text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th style={{ width: "100px" }}>Period</th>
                {daysOrder.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...Array(maxPeriod)].map((_, index) => {
                const period = index + 1;

                return (
                  <tr key={period}>
                    <td className="fw-bold bg-light">
                      {period}
                      <div className="small text-muted">
                        {PERIODS[period - 1]?.time}
                      </div>
                    </td>

                    {daysOrder.map((day) => {
                      const item = matrix[period]?.[day];

                      return (
                        <td key={day}>
                          {item ? (
                            <>
                              <div className="fw-semibold text-primary">
                                {item.subjectId?.name}
                              </div>
                              <div className="fw-semibold text-dark">
                                Class {item.classId?.className}
                              </div>
                            </>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TimeTable;