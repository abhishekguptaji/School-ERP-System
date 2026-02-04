import  { useEffect, useState } from "react";
import { getAdminProfile } from "../../services/authService.js";
import "./css/AdminProfile.css";
function AdminProfile(){
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return <>
    <div className="profile-container">
  <div className="profile-card">
    <div className="avatar">
      {admin.name.charAt(0)}
    </div>

    <h2 className="name">{admin.name}</h2>
    <p className="email">{admin.email}</p>

    <span className="role">{admin.role}</span>

    <p className="date">
      Joined on {new Date(admin.createdAt).toLocaleDateString()}
    </p>
  </div>
</div>

  </>
};

export default AdminProfile;
