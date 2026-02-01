function AdminProfile() {
  // Demo data (replace later with API data)
  const admin = {
    name: "Abhishek Gupta",
    role: "Administrator",
    email: "admin@schoolerp.com",
    adminId: "ADM001",
    status: "Active",
    createdAt: "01 Jan 2024",
    lastLogin: "22 Jan 2026, 10:30 AM",
    phone: "+91 9876543210",
    office: "Main Office, Block A",
  };

  return (
    <div className="">


      {/* MIDDLE CONTENT (SCROLLABLE) */}
      <div className="flex-grow-1 overflow-y-auto bg-light">
        <div className="container py-4">

          {/* PROFILE HEADER (VERTICAL) */}
          <div className="card shadow mb-4">
            <div className="card-body text-center">
              <img
                src="https://via.placeholder.com/100"
                alt="Profile"
                className="rounded-circle mb-3"
              />
              <h5 className="mb-1">{admin.name}</h5>
              <p className="text-muted mb-0">{admin.role}</p>
              <p className="text-muted">{admin.email}</p>
            </div>
          </div>

          {/* BASIC INFORMATION */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h6 className="mb-3 border-bottom pb-2">Basic Information</h6>
              <p><strong>Admin ID:</strong> {admin.adminId}</p>
              <p>
                <strong>Status:</strong>
                <span className="badge bg-success ms-2">{admin.status}</span>
              </p>
              <p><strong>Role:</strong> {admin.role}</p>
            </div>
          </div>

          {/* ACCOUNT DETAILS */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h6 className="mb-3 border-bottom pb-2">Account Details</h6>
              <p><strong>Account Created:</strong> {admin.createdAt}</p>
              <p><strong>Last Login:</strong> {admin.lastLogin}</p>
            </div>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h6 className="mb-3 border-bottom pb-2">Contact Information</h6>
              <p><strong>Email:</strong> {admin.email}</p>
              <p><strong>Phone:</strong> {admin.phone}</p>
              <p><strong>Office:</strong> {admin.office}</p>
            </div>
          </div>

          {/* SECURITY */}
          <div className="card shadow">
            <div className="card-body">
              <h6 className="mb-3 border-bottom pb-2">Security</h6>

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

export default AdminProfile;
