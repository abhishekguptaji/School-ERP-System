import { useEffect, useState } from "react";
import "./css/TStudent.css";
import { getMyStudentInTeacherPanel } from "../../services/teacherService.js";

function TStudents() {
  const [allocations, setAllocations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getMyStudentInTeacherPanel();
      console.log(res.data);
      setAllocations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

return (
  <div className="tstudents-container">
    {allocations?.length > 0 ? (
      allocations.map((allocation) => (
        <div key={allocation.classId?._id} className="class-card">
          
          <div className="class-header">
            <h3>Class {allocation.classId?.className}</h3>
            <span className="subject-badge">
              {allocation.subjectId?.name}
            </span>
          </div>

          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Campus ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {allocation.students?.map((student) => (
                  <tr key={student._id}>
                    <td>{student.user?.campusId}</td>
                    <td>{student.user?.name}</td>
                    <td>{student.user?.email}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleViewProfile(student)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      ))
    ) : (
      <p className="no-data">No Students Found</p>
    )}

    {/* 🔥 Modern Profile Modal */}
    {showModal && selectedStudent && (
      <div className="modal-overlay">
        <div className="profile-modal">

          <div className="profile-header">
            <img
              src={selectedStudent.userImage || "/default-avatar.png"}
              alt="student"
              className="profile-img"
            />
            <div>
              <h2>{selectedStudent.user?.name}</h2>
              <p>{selectedStudent.user?.email}</p>
              <span className="campus-id">
                {selectedStudent.user?.campusId}
              </span>
            </div>
          </div>

          <div className="profile-grid">

            <div>
              <label>Admission No</label>
              <p>{selectedStudent.admissionNumber || "N/A"}</p>
            </div>

            <div>
              <label>Date of Birth</label>
              <p>
                {selectedStudent.dob
                  ? new Date(selectedStudent.dob).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
            </div>

            <div>
              <label>Father Name</label>
              <p>{selectedStudent.father?.name || "N/A"}</p>
            </div>

            <div>
              <label>Phone</label>
              <p>{selectedStudent.father?.phone || "N/A"}</p>
            </div>

            <div>
              <label>Gender</label>
              <p>{selectedStudent.gender || "N/A"}</p>
            </div>

            <div>
              <label>Blood Group</label>
              <p>{selectedStudent.bloodGroup || "N/A"}</p>
            </div>

            <div className="full-width">
              <label>Address</label>
              <p>{selectedStudent.address?.city || "N/A"}</p>
            </div>

          </div>

          <button
            className="close-btn"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>

        </div>
      </div>
    )}
  </div>
);
}

export default TStudents;
