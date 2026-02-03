import { Link } from "react-router-dom";
import "./css/ShowClasses.css";

const classes = [
  { id: 1, name: "Class 1" },
  { id: 2, name: "Class 2" },
  { id: 3, name: "Class 3" },
  { id: 4, name: "Class 4" },
  { id: 5, name: "Class 5" },
  { id: 6, name: "Class 6" },
  { id: 7, name: "Class 7" },
  { id: 8, name: "Class 8" },
  { id: 9, name: "Class 9" },
  { id: 10, name: "Class 10" },
  { id: 11, name: "Class 11" },
  { id: 12, name: "Class 12" },
];

function ShowClasses() {
  return (
    <div className="container mt-4">
      <h4 className="mb-4 text-center">Select Class</h4>

      <div className="row g-4">
        {classes.map((cls) => (
          <div className="col-6 col-md-4 col-lg-3" key={cls.id}>
            <Link
              to={`admin/classes/${cls.id}`}
              className="class-card text-decoration-none"
            >
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <h5 className="card-title">{cls.name}</h5>
                  <span className="view-text">View Details →</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowClasses;