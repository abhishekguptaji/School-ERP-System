import "./css/StuProfile.css";

function StuProfile() {
  return (
    <div className="container-fluid px-5 mt-3">
      <div className="profile-card p-4 shadow-sm">
        <h4 className="text-center mb-4">Student Profile</h4>

        {/* ================= IMAGE SECTION ================= */}
        <div className="section">
          
          <div className="row">
            
            <div className="col">
              
              <div className="image-box">
                
                <label className="image-label">Student</label>
                <div className="image-preview">
                  
                  <span>No Photo</span>
                </div>
              </div>
            </div>
            <div className="col">
              
              <div className="image-box">
                
                <label className="image-label">Father</label>
                <div className="image-preview">
                  
                  <span>No Photo</span>
                </div>
              </div>
            </div>
            <div className="col">
              
              <div className="image-box">
                
                <label className="image-label">Mother</label>
                <div className="image-preview">
                  
                  <span>No Photo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BASIC INFORMATION ================= */}
        <fieldset className="border p-3 mb-4">
          <legend className="float-none w-auto px-2">Basic Information</legend>

          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Admission No</label>
              <input className="form-control" placeholder="ADM2024XXX" />
            </div>

            <div className="col-md-3">
              <label className="form-label">Roll No</label>
              <input type="number" className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label">Gender</label>
              <select className="form-select">
                <option>Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* ================= ACADEMIC INFORMATION ================= */}
        <fieldset className="border p-3 mb-4">
          <legend className="float-none w-auto px-2">Academic Details</legend>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Class</label>
              <select className="form-select"></select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Section</label>
              <select className="form-select"></select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Academic Year</label>
              <select className="form-select"></select>
            </div>
          </div>
        </fieldset>

        {/* ================= PARENT DETAILS ================= */}
        <fieldset className="border p-3 mb-4">
          <legend className="float-none w-auto px-2">Parent Details</legend>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Father Name</label>
              <input className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Father Phone</label>
              <input className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Father Occupation</label>
              <input className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Mother Name</label>
              <input className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Mother Phone</label>
              <input className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Mother Occupation</label>
              <input className="form-control" />
            </div>
          </div>
        </fieldset>

        {/* ================= ADDRESS ================= */}
        <fieldset className="border p-3 mb-4">
          <legend className="float-none w-auto px-2">Address</legend>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">City</label>
              <input className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">State</label>
              <input className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Pincode</label>
              <input className="form-control" />
            </div>
          </div>
        </fieldset>

        {/* ================= DOCUMENTS ================= */}
        <fieldset className="border p-3 mb-4">
          <legend className="float-none w-auto px-2">Documents</legend>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Aadhaar Number</label>
              <input className="form-control" />
            </div>
          </div>
        </fieldset>

        {/* ================= ACTION ================= */}
        <div className="text-center">
          <button className="btn btn-primary px-5">Save Profile</button>
        </div>
      </div>
    </div>
  );
}

export default StuProfile;
