import { useEffect, useState } from "react";
import { getAdminProfile } from "../../services/authService";

// function AdminProfile() {
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadProfile = async () => {
//       const response = await getAdminProfile();
//       console.log("Admin API Response:", response);

//       if (response.success) {
//         setAdmin(response.data);
//       } else {
//         setError(response.message);
//       }

//       setLoading(false);
//     };

//     loadProfile();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-4">Loading admin profile...</p>;
//   }

//   if (error) {
//     return (
//       <p className="text-danger text-center mt-4">
//         {error}
//       </p>
//     );
//   }

//   // ✅ CRITICAL GUARD
//   if (!admin) return null;

//   return (
//     <div className="container mt-4">
//       <div className="card shadow-sm">
//         <div className="card-header bg-primary text-white">
//           <h5 className="mb-0">Admin Profile</h5>
//         </div>

//         <div className="card-body">
//           <ProfileRow label="ID" value={admin._id} />
//           <ProfileRow label="Name" value={admin.name} />
//           <ProfileRow label="Email" value={admin.email} />
//           <ProfileRow label="Role" value={admin.role} />
//           <ProfileRow
//             label="Status"
//             value={admin.isActive ? "Active" : "Inactive"}
//             badge={admin.isActive ? "success" : "danger"}
//           />
//           <ProfileRow
//             label="Created At"
//             value={new Date(admin.createdAt).toLocaleString()}
//           />
//           <ProfileRow
//             label="Updated At"
//             value={new Date(admin.updatedAt).toLocaleString()}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminProfile;

// /* ---------- Reusable Row ---------- */
// function ProfileRow({ label, value, badge }) {
//   return (
//     <div className="row mb-2">
//       <div className="col-md-4 fw-semibold">{label}</div>
//       <div className="col-md-8">
//         {badge ? (
//           <span className={`badge bg-${badge}`}>{value}</span>
//         ) : (
//           value
//         )}
//       </div>
//     </div>
//   );
// }

function AdminProfile(){
  
    
      const response = getAdminProfile();
      console.log("Admin API Response:", response.data);

      

  
  return <>
   
  </>;
}

export default AdminProfile;