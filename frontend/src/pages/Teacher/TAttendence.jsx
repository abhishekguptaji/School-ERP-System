import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getMyStudentByClasses,
  markAttendance,
} from "../../services/teacherService.js";

function TAttendence() {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [date, setDate] = useState("");
  const [classId, setClassId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await getMyStudentByClasses();
    const classStudents = res.data;

    setStudents(classStudents);

    if (res.classId) {
      setClassId(res.classId);
    }

    setDefaultAttendance(classStudents);
  };

  const setDefaultAttendance = (studentList) => {
    const initial = {};
    studentList.forEach((student) => {
      initial[student._id] = "Present";
    });
    setAttendanceData(initial);
  };

  const handleChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    if (!date) {
      Swal.fire({
        icon: "warning",
        title: "Select Date",
        text: "Please select attendance date",
      });
      return;
    }

    try {
      const studentsArray = students.map((student) => ({
        student: student._id,
        status: attendanceData[student._id],
      }));

      const payload = {
        classId,
        date,
        students: studentsArray,
      };

      await markAttendance(payload);
      Swal.fire({
        icon: "success",
        title: "Attendance Uploaded",
        text: "Attendance marked successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      setDate("");
      setDefaultAttendance(students);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <div className="container ">
      <h3 className="text-center mb-4">Upload Daily Attendance</h3>

      <input
        type="date"
        className="form-control mb-3"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Roll</th>
            <th>Name</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.admissionNumber}</td>
              <td>{student.user?.name}</td>

              <td>
                <input
                  type="radio"
                  name={student._id}
                  checked={attendanceData[student._id] === "Present"}
                  onChange={() =>
                    handleChange(student._id, "Present")
                  }
                />
              </td>

              <td>
                <input
                  type="radio"
                  name={student._id}
                  checked={attendanceData[student._id] === "Absent"}
                  onChange={() =>
                    handleChange(student._id, "Absent")
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mt-3">
  <button className="btn btn-dark" onClick={handleSubmit}>
    Submit Attendance
  </button>
</div>
    </div>
  );
}

export default TAttendence;