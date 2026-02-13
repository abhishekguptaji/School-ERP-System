import "./css/TDashboard.css";
import {getDashboardProfile} from "../../services/teacherService.js";
import { useEffect, useState } from "react";
function TDashboard(){
   const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState(null);
    const [error, setError] = useState("");
  
    const fetchTeacher = async () => {
      setLoading(true);
      setError("");
  
      const res = await getDashboardProfile();
  
      if (!res?.success) {
        setError(res?.message || "Failed to load student data");
        setLoading(false);
        return;
      }
  
      setTeacher(res?.data);
      console.log(res?.data);
      setLoading(false);
    };
  
    useEffect(() => {
      fetchTeacher();
    }, []);
  
    if (loading) {
      return <div className="dash-loading">Loading student dashboard...</div>;
    }
  
    if (error) {
      return (
        <div className="dash-error">
          <h3>Complete The Profile First</h3>
          <p>{error}</p>
          <button onClick={fetchTeacher}>Retry</button>
        </div>
      );
    }

  return<>
<div className="container">
  <div className="row g-3">
 <div className="col-lg-4">
  <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
   
    {/* CARD BODY */}
    <div className="card-body p-4">
      <div className="text-center">
        <img
          src={teacher?.teacherImage || "/default-user.png"}
          alt="teacher"
          className="rounded-circle shadow-sm"
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            border: "4px solid #f1f1f1",
          }}
          onError={(e) => (e.target.src = "/default-user.png")}
        />

        <h4 className="fw-bold mt-3 mb-0">{teacher?.user?.name || "-"}</h4>
        <p className="text-muted mb-2">{teacher?.user?.email || "-"}</p>

        <span className="badge bg-primary px-3 py-2 rounded-pill">
          {teacher?.designation || "N/A"}
        </span>
      </div>

      <hr className="my-4" />

      {/* DETAILS */}
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-muted fw-semibold">Campus ID</span>
        <span className="fw-bold">{teacher?.user?.campusId || "-"}</span>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2">
        <span className="text-muted fw-semibold">Service Years</span>
        <span className="fw-bold">{teacher?.serviceYears ?? "N/A"}</span>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2">
        <span className="text-muted fw-semibold">Teacher Age</span>
        <span className="fw-bold">{teacher?.teacherAge ?? "N/A"}</span>
      </div>
    </div>
  </div>
</div>

  {/* RIGHT SIDE */}
  <div className="col-lg-8">
    {/* your other dashboard UI */}
  </div>
</div>
</div>
  
  
  
  </>;
}
export default TDashboard;