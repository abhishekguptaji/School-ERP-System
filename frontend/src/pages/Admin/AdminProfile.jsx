import { useEffect, useState } from "react";
import { getAdminProfile } from "../../services/authService.js";
import "./css/AdminProfile.css";

function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await getAdminProfile();
        setAdmin(res.data);
      } catch (err) {
        setError("Failed to load admin data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading)
    return (
      <div className="adminProfileLoading">
        <div className="spinner-border" role="status"></div>
        <p className="mt-3 mb-0">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="adminProfileError">
        <i className="bi bi-exclamation-triangle-fill"></i>
        <h5 className="mb-1">Something went wrong</h5>
        <p className="mb-0">{error}</p>
      </div>
    );

  return (
    <div className="adminProfilePage">
      <div className="container py-4" style={{ maxWidth: 950 }}>


        {/* PROFILE CARD */}
        <div className="card adminProfileCard border-0 shadow-sm">
          {/* TOP STRIP */}
          <div className="adminProfileTop">
            <div className="adminAvatar">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
            </div>

            <div className="adminTopInfo">
              <h4 className="mb-1 fw-bold">{admin?.name || "-"}</h4>
              <div className="adminEmail">
                <i className="bi bi-envelope-fill me-2"></i>
                {admin?.email || "-"}
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="card-body p-4 p-md-5">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="adminInfoBox">
                  <div className="adminInfoLabel">
                    <i className="bi bi-person-badge-fill me-2"></i>
                    Full Name
                  </div>
                  <div className="adminInfoValue">{admin?.name || "-"}</div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="adminInfoBox">
                  <div className="adminInfoLabel">
                    <i className="bi bi-envelope-at-fill me-2"></i>
                    Email Address
                  </div>
                  <div className="adminInfoValue">{admin?.email || "-"}</div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="adminInfoBox">
                  <div className="adminInfoLabel">
                    <i className="bi bi-shield-check me-2"></i>
                    Role
                  </div>
                  <div className="adminInfoValue text-capitalize">
                    {admin?.role || "-"}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="adminInfoBox">
                  <div className="adminInfoLabel">
                    <i className="bi bi-calendar-event-fill me-2"></i>
                    Joined On
                  </div>
                  <div className="adminInfoValue">
                    {admin?.createdAt
                      ? new Date(admin.createdAt).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* NOTE */}
            <div className="adminProfileNote mt-4">
              <i className="bi bi-info-circle-fill me-2"></i>
              This is your official admin account profile for Campus ERP.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
