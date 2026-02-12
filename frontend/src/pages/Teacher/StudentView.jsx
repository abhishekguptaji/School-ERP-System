import { useMemo, useState } from "react";
import "./css/StudentView.css";

function StudentView() {
  // UI ONLY dummy data (replace later with API response)
  const [students] = useState([
    {
      _id: "1",
      name: "Rahul Sharma",
      rollNumber: "101",
      admissionNo: "ADM-2026-01",
      className: "10",
      section: "A",
      fatherName: "Suresh Sharma",
      phone: "9876543210",
      email: "rahul@gmail.com",
      status: "active",
      dob: "2010-06-11",
      gender: "Male",
      address: "Near Main Road, Lucknow, UP",
      studentImage:
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    {
      _id: "2",
      name: "Priya Verma",
      rollNumber: "102",
      admissionNo: "ADM-2026-02",
      className: "10",
      section: "A",
      fatherName: "Ramesh Verma",
      phone: "9999999999",
      email: "priya@gmail.com",
      status: "active",
      dob: "2010-09-15",
      gender: "Female",
      address: "Sector 12, Noida, UP",
      studentImage:
        "https://cdn-icons-png.flaticon.com/512/3135/3135789.png",
    },
  ]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = [...students];
    if (!search.trim()) return list;

    const s = search.toLowerCase();
    return list.filter((st) => {
      return (
        st?.name?.toLowerCase().includes(s) ||
        st?.rollNumber?.toLowerCase().includes(s) ||
        st?.admissionNo?.toLowerCase().includes(s) ||
        `${st?.className}${st?.section}`.toLowerCase().includes(s)
      );
    });
  }, [students, search]);

  return (
    <div className="container-fluid mt-4">
      <div className="row g-3">
        {/* LEFT LIST */}
        <div className="col-12 col-lg-5">
          <div className="sv-card">
            <div className="sv-header">
              <div>
                <h4 className="mb-0 fw-bold text-primary">Student View</h4>
                <p className="mb-0 text-muted small">
                  Search and open student profile
                </p>
              </div>
            </div>

            <div className="sv-search">
              <input
                className="form-control rounded-3"
                placeholder="Search by Roll No / Admission No / Name / Class..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="sv-list">
              {filtered.length === 0 ? (
                <div className="p-3 text-muted">No student found.</div>
              ) : (
                filtered.map((st) => (
                  <button
                    key={st._id}
                    className={`sv-item ${
                      selected?._id === st._id ? "active" : ""
                    }`}
                    onClick={() => setSelected(st)}
                  >
                    <div className="d-flex gap-3 align-items-center">
                      <img
                        src={st.studentImage}
                        alt="student"
                        className="sv-avatar"
                      />

                      <div className="text-start">
                        <div className="fw-bold sv-name">{st.name}</div>
                        <div className="text-muted small">
                          Roll: {st.rollNumber} • {st.className}-{st.section}
                        </div>
                        <div className="text-muted small">
                          Admission: {st.admissionNo}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`badge ${
                        st.status === "active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {st.status}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="col-12 col-lg-7">
          <div className="sv-card">
            {!selected ? (
              <div className="p-4 text-muted">
                Select a student from the left to view full profile.
              </div>
            ) : (
              <>
                {/* TOP PROFILE */}
                <div className="sv-profileTop">
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <img
                      src={selected.studentImage}
                      alt="student"
                      className="sv-profileImg"
                    />

                    <div>
                      <h4 className="mb-0 fw-bold">{selected.name}</h4>
                      <div className="text-muted">
                        Class:{" "}
                        <b>
                          {selected.className}-{selected.section}
                        </b>{" "}
                        • Roll: <b>{selected.rollNumber}</b>
                      </div>
                      <div className="text-muted small">
                        Admission No: <b>{selected.admissionNo}</b>
                      </div>
                    </div>
                  </div>

                  <div className="sv-status">
                    <span
                      className={`badge ${
                        selected.status === "active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {selected.status}
                    </span>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-3">
                  <div className="sv-sectionTitle">Student Details</div>

                  <div className="sv-grid">
                    <div className="sv-field">
                      <label>Gender</label>
                      <p>{selected.gender}</p>
                    </div>

                    <div className="sv-field">
                      <label>Date of Birth</label>
                      <p>
                        {selected.dob
                          ? new Date(selected.dob).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>

                    <div className="sv-field">
                      <label>Phone</label>
                      <p>{selected.phone}</p>
                    </div>

                    <div className="sv-field">
                      <label>Email</label>
                      <p>{selected.email}</p>
                    </div>
                  </div>

                  <div className="sv-sectionTitle mt-3">Parent Details</div>

                  <div className="sv-grid">
                    <div className="sv-field">
                      <label>Father Name</label>
                      <p>{selected.fatherName}</p>
                    </div>
                  </div>

                  <div className="sv-sectionTitle mt-3">Address</div>

                  <div className="sv-grid">
                    <div className="sv-field full">
                      <label>Full Address</label>
                      <p>{selected.address}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentView;
