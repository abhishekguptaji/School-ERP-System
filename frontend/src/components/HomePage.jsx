import { Link } from "react-router-dom";
import "./css/HomePage.css";

export default function HomePage() {
  return (
    <div className="homepage">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold fs-4 text-primary">
            School ERP
          </span>
          <div className="ms-auto">
            <Link to="/login" className="btn btn-primary fw-semibold">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section d-flex align-items-center">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-5 fw-bold mb-3 text-primary">
                Gupta Ji Public School
              </h1>
              <h3 className="fw-semibold mb-4 text-secondary">
                ERP Campus Management System
              </h3>
              <p className="lead mb-4 text-muted">
                A complete School ERP solution to manage students, teachers,
                attendance, exams, results, fees, and administration from one
                centralized digital platform.
              </p>
              <Link to="/login" className="btn btn-primary btn-lg fw-bold">
                Login to ERP
              </Link>
            </div>

            <div className="col-md-6 text-center">
              <img
                src="/School_image.jpg"
                alt="School ERP"
                className="img-fluid hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5 text-primary">
            ERP Features
          </h2>
          <div className="row g-4">
            <Feature
              title="Student Management"
              desc="Student profiles, attendance, exams, and results."
            />
            <Feature
              title="Teacher Dashboard"
              desc="Class management, marks entry, and reports."
            />
            <Feature
              title="Secure Login"
              desc="Role-based access for Admin, Teacher, and Student."
            />
            <Feature
              title="Reports & Analytics"
              desc="Daily, monthly, and yearly academic insights."
            />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer bg-light text-muted py-3 text-center border-top">
        © {new Date().getFullYear()} ABC Public School ERP | All Rights Reserved
      </footer>

    </div>
  );
}

/* ================= FEATURE CARD ================= */
function Feature({ title, desc }) {
  return (
    <div className="col-md-3">
      <div className="card h-100 feature-card shadow-sm border-0">
        <div className="card-body text-center">
          <h5 className="card-title fw-bold text-primary">{title}</h5>
          <p className="card-text text-muted">{desc}</p>
        </div>
      </div>
    </div>
  );
}
