function TeacherProfile() {
  const teacher = {
    name: "Rahul Sharma",
    role: "Teacher",
    employeeId: "TCH102",
    designation: "PGT – Mathematics",
    department: "Mathematics",
    qualification: "M.Sc, B.Ed",
    experience: "8 Years",
    dateOfJoining: "15 June 2018",
    employmentType: "Permanent",

    email: "rahul.sharma@schoolerp.com",
    personalEmail: "rahul@gmail.com",
    phone: "+91 9876543210",
    address: "New Delhi, India",

    classesAssigned: "9A, 10B",
    subjectsTeaching: "Mathematics",
    classTeacherOf: "10B",

    status: "Active",
    lastLogin: "22 Jan 2026, 09:15 AM",
  };

  return (
    <div className="d-flex flex-column vh-100 overflow-x-hidden">

      {/* MIDDLE CONTENT (SCROLLABLE) */}
      <div className="flex-grow-1 overflow-y-auto bg-light">
        <div className="container py-4">

          {/* PROFILE HEADER */}
          <div className="card shadow mb-4">
            <div className="card-body text-center">
              <img
                src="https://via.placeholder.com/100"
                alt="Profile"
                className="rounded-circle mb-3"
              />
              <h5 className="mb-1">{teacher.name}</h5>
              <p className="text-muted mb-0">{teacher.designation}</p>
              <p className="text-muted">{teacher.email}</p>
            </div>
          </div>

          {/* BASIC INFORMATION */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h6 className="mb-3 border-bottom pb-2">Basic Information</h6>
              <p><strong>Employee ID:</strong> {teacher.employeeId}</p>
              <p><strong>Role:</strong> {teacher.role}</p>
              <p>
                <strong>Status:</strong>
                <span className="badge bg-success ms-2">{teacher.status}</span>
              </p>
            </div>
          </div>

          {/* PROFESSIONAL DETAILS */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h6 className="mb-3 border-bottom pb-2">Professional Details</h6>
              <p><strong>Designation:</strong> {teacher.designation}</p>
              <p><strong>Department:</strong> {teacher.department}</p>
              <p><strong>Qualification:</strong> {teacher.qualification}</p>
              <p><strong>Experience:</strong> {teacher.experience}</p>
              <p><strong>Date of Joining:</strong> {teacher.dateOfJoining}</p>
              <p><strong>Employment Type:</strong> {teacher.employmentType}</p>
            </div>
          </div>

          {/* TEACHING ASSIGNMENT */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h6 className="mb-3 border-bottom pb-2">Teaching Assignment</h6>
              <p><strong>Classes Assigned:</strong> {teacher.classesAssigned}</p>
              <p><strong>Subjects Teaching:</strong> {teacher.subjectsTeaching}</p>
              <p><strong>Class Teacher Of:</strong> {teacher.classTeacherOf}</p>
            </div>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h6 className="mb-3 border-bottom pb-2">Contact Information</h6>
              <p><strong>Official Email:</strong> {teacher.email}</p>
              <p><strong>Personal Email:</strong> {teacher.personalEmail}</p>
              <p><strong>Mobile:</strong> {teacher.phone}</p>
              <p><strong>Address:</strong> {teacher.address}</p>
            </div>
          </div>

          {/* ACCOUNT & SECURITY */}
          <div className="card shadow">
            <div className="card-body">
              <h6 className="mb-3 border-bottom pb-2">Account & Security</h6>
              <p><strong>Last Login:</strong> {teacher.lastLogin}</p>

              <button className="btn btn-primary me-2">
                Change Password
              </button>

              <button className="btn btn-outline-danger">
                Logout from all devices
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
