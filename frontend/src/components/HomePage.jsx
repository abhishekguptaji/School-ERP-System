import { Link } from "react-router-dom";
import "./css/HomePage.css";

function HomePage() {
  return (
    <div className="homepage">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg fixed-top navbar-blur shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold fs-4 text-primary d-flex align-items-center gap-2">
            <i className="bi bi-building-fill-check"></i>
            School ERP
          </span>

          <div className="ms-auto d-flex align-items-center gap-2">
            <Link
              to="/login"
              className="btn btn-primary fw-semibold px-4 rounded-3"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section d-flex align-items-center">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6 ">
              <h1 className="display-5 fw-bold mb-3 hero-title">
                Gupta Ji Public School
              </h1>

              <h4 className="fw-semibold mb-3 text-secondary">
                ERP Campus Management System
              </h4>

              <p className="lead mb-4 text-muted ">
                A complete School ERP solution to manage students, teachers,
                attendance, exams, results, fees, and administration from one
                centralized digital platform.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link
                  to="/login"
                  className="btn btn-primary btn-lg fw-bold px-4 rounded-3"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login to ERP
                </Link>

                <a
                  href="#features"
                  className="btn btn-outline-primary btn-lg fw-bold px-4 rounded-3"
                >
                  <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                  Explore Features
                </a>
              </div>
            </div>

            <div className="col-md-6 text-center">
              <div className="hero-image-wrap shadow-sm">
                <img
                  src="/School_image.jpg"
                  alt="School ERP"
                  className="img-fluid hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="features-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-primary mb-2">ERP Features</h2>
            <p className="text-muted mb-0">
              Everything you need to run a modern school, in one dashboard.
            </p>
          </div>

          <div className="row g-4">
            <Feature
              icon="bi-people-fill"
              title="Student Management"
              desc="Student profiles, attendance, exams, and results."
            />
            <Feature
              icon="bi-person-workspace"
              title="Teacher Dashboard"
              desc="Class management, marks entry, and reports."
            />
            <Feature
              icon="bi-shield-lock-fill"
              title="Secure Login"
              desc="Role-based access for Admin, Teacher, and Student."
            />
            <Feature
              icon="bi-bar-chart-fill"
              title="Reports & Analytics"
              desc="Daily, monthly, and yearly academic insights."
            />
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-card shadow-sm">
            <div className="row g-4 align-items-center">
              <div className="col-md-8">
                <h3 className="fw-bold mb-2">Ready to use School ERP?</h3>
                <p className="text-muted mb-0">
                  Login and start managing your campus with attendance, results,
                  fees, library and more.
                </p>
              </div>

              <div className="col-md-4 text-md-end">
                <Link
                  to="/login"
                  className="btn btn-primary btn-lg fw-bold px-4 rounded-3"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer py-4 text-center border-top bg-white">
        <div className="container">
          <div className="fw-semibold">
            © {new Date().getFullYear()} Gupta Ji Public School ERP
          </div>
          <div className="text-muted small">
            All Rights Reserved • Designed for Students, Teachers & Admin
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;

/* ================= FEATURE CARD ================= */
function Feature({ icon, title, desc }) {
  return (
    <div className="col-md-3">
      <div className="card h-100 feature-card border-0 shadow-sm">
        <div className="card-body p-4 text-center">
          <div className="feature-icon mb-3">
            <i className={`bi ${icon}`}></i>
          </div>
          <h5 className="card-title fw-bold mb-2">{title}</h5>
          <p className="card-text text-muted mb-0">{desc}</p>
        </div>
      </div>
    </div>
  );
}
