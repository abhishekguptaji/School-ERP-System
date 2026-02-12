import { useEffect, useState } from "react";
import "./css/StuProfile.css";
import {
  getStudentProfile,
  createStudentProfile,
} from "../../services/authService.js";
import Swal from "sweetalert2";


function StuProfile() {
  const [loading, setLoading] = useState(true);
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ================= FORM DATA (FLAT FOR UI) =================
  const [formData, setFormData] = useState({
    // user
    name: "",
    email: "",
    campusId: "",

    // profile basic
    admissionNumber: "",
    className: "",
    dob: "",
    gender: "",
    bloodGroup: "",

    // address
    city: "",
    state: "",
    pincode: "",

    // father
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",

    // mother
    motherName: "",
    motherPhone: "",
    motherOccupation: "",

    // guardian
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",

    // documents
    aadhaarNumber: "",
  });

  // ================= IMAGE URLS (FROM BACKEND) =================
  const [imageUrls, setImageUrls] = useState({
    userImage: "",
    fatherImage: "",
    motherImage: "",
  });

  // ================= IMAGE FILES (FOR UPLOAD) =================
  const [imageFiles, setImageFiles] = useState({
    userImage: null,
    fatherImage: null,
    motherImage: null,
  });

  // ================= IMAGE PREVIEWS (LOCAL FILE PREVIEW) =================
  const [previews, setPreviews] = useState({
    userImage: "",
    fatherImage: "",
    motherImage: "",
  });

  // ================= GET PROFILE =================
  const fetchProfile = async () => {
    setLoading(true);

    const res = await getStudentProfile();

    if (res?.success === false) {
      Swal.fire({
              icon: "error",
              title: "Error",
              text: res?.message || "Failed to fetch profile",
            });
      setLoading(false);
      return;
    }

    const payload = res?.data;

    // if profile not created
    if (payload?.isProfileCreated === false) {
      const user = payload?.user;

      setFormData((prev) => ({
        ...prev,
        name: user?.name || "",
        email: user?.email || "",
        campusId: user?.campusId || "",
      }));

      setIsProfileCreated(false);
      setIsEditing(true);
      setLoading(false);
      return;
    }

    // if profile created
    const user = payload?.user;
    const profile = payload?.profile;

    setFormData({
      // user
      name: user?.name || "",
      email: user?.email || "",
      campusId: user?.campusId || "",

      // profile basic
      admissionNumber: profile?.admissionNumber || "",
      className: profile?.className || "",
      dob: profile?.dob ? profile?.dob?.slice(0, 10) : "",
      gender: profile?.gender || "",
      bloodGroup: profile?.bloodGroup || "",

      // address
      city: profile?.address?.city || "",
      state: profile?.address?.state || "",
      pincode: profile?.address?.pincode || "",

      // father
      fatherName: profile?.father?.name || "",
      fatherPhone: profile?.father?.phone || "",
      fatherOccupation: profile?.father?.occupation || "",

      // mother
      motherName: profile?.mother?.name || "",
      motherPhone: profile?.mother?.phone || "",
      motherOccupation: profile?.mother?.occupation || "",

      // guardian
      guardianName: profile?.guardian?.name || "",
      guardianRelation: profile?.guardian?.relation || "",
      guardianPhone: profile?.guardian?.phone || "",

      // documents
      aadhaarNumber: profile?.documents?.aadhaarNumber || "",
    });

    // store backend image urls
    setImageUrls({
      userImage: profile?.userImage || "",
      fatherImage: profile?.fatherImage || "",
      motherImage: profile?.motherImage || "",
    });

    // reset previews + files
    setPreviews({
      userImage: "",
      fatherImage: "",
      motherImage: "",
    });

    setImageFiles({
      userImage: null,
      fatherImage: null,
      motherImage: null,
    });

    setIsProfileCreated(true);
    setIsEditing(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= IMAGE CHANGE =================
  const handleImageChange = (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFiles((prev) => ({
      ...prev,
      [key]: file,
    }));

    const previewUrl = URL.createObjectURL(file);

    setPreviews((prev) => ({
      ...prev,
      [key]: previewUrl,
    }));
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      if (!formData.dob) return alert("DOB is required");
      if (!formData.gender) return alert("Gender is required");
      if (!formData.city) return alert("City is required");
      if (!formData.fatherName) return alert("Father Name is required");
      if (!formData.motherName) return alert("Mother Name is required");
      if (!formData.aadhaarNumber) return alert("Aadhaar Number is required");

      const payload = new FormData();

      // ✅ IMPORTANT: send JSON in "data"
      const jsonData = {
        admissionNumber: formData.admissionNumber,
        className: formData.className,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,

        address: {
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },

        father: {
          name: formData.fatherName,
          phone: formData.fatherPhone,
          occupation: formData.fatherOccupation,
        },

        mother: {
          name: formData.motherName,
          phone: formData.motherPhone,
          occupation: formData.motherOccupation,
        },

        guardian: {
          name: formData.guardianName,
          relation: formData.guardianRelation,
          phone: formData.guardianPhone,
        },

        documents: {
          aadhaarNumber: formData.aadhaarNumber,
        },
      };

      payload.append("data", JSON.stringify(jsonData));

      // images
      if (imageFiles.userImage)
        payload.append("userImage", imageFiles.userImage);
      if (imageFiles.fatherImage)
        payload.append("fatherImage", imageFiles.fatherImage);
      if (imageFiles.motherImage)
        payload.append("motherImage", imageFiles.motherImage);

      const res = await createStudentProfile(payload);

      if (res?.success === false) {
         Swal.fire({
              icon: "error",
              title: "Error",
              text: res?.message || "Failed to save profile",
            });
        return;
      }
      Swal.fire({
              icon: "success",
              title: "Success",
              text: "Profile Save Successfully",
              timer: 1000,
              showConfirmButton: false,
            });
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.log("SAVE ERROR:", err);
    }
  };

  // ================= UI =================
if (loading) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <div className="spinner-border text-primary"></div>
        <div className="mt-2 fw-semibold">Loading profile...</div>
      </div>
    </div>
  );
}

return (
  <div className="min-vh-100 bg-light py-4">
    <div className="container" style={{ maxWidth: 1200 }}>
      {/* ===== HEADER ===== */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-person-badge-fill text-primary me-2"></i>
            Student Profile
          </h3>
          <div className="text-muted">
            View and update your personal and family details
          </div>
        </div>

        {/* Actions */}
        {!isEditing ? (
          <button
            type="button"
            className="btn btn-primary rounded-3 px-4"
            onClick={() => setIsEditing(true)}
          >
            <i className="bi bi-pencil-square me-2"></i>
            Edit Profile
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-3 px-4"
              onClick={() => setIsEditing(false)}
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-success rounded-3 px-4"
              onClick={handleSave}
            >
              <i className="bi bi-check2-circle me-2"></i>
              Save
            </button>
          </div>
        )}
      </div>

      {/* ===== TOP PROFILE CARD ===== */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <div className="p-4 bg-primary text-white">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-white text-primary rounded-4 d-flex align-items-center justify-content-center"
                style={{ width: 56, height: 56 }}
              >
                <i className="bi bi-person-fill fs-3"></i>
              </div>

              <div>
                <div className="fw-bold fs-4">{formData.name || "Student"}</div>
                <div className="text-white-50">
                  {formData.email || "No email"}
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <span className="badge text-bg-light border text-dark rounded-pill px-3 py-2">
                <i className="bi bi-upc-scan me-2"></i>
                Campus ID: <b>{formData.campusId || "N/A"}</b>
              </span>

              <span className="badge text-bg-light border text-dark rounded-pill px-3 py-2">
                <i className="bi bi-mortarboard me-2"></i>
                Class: <b>{formData.className || "N/A"}</b>
              </span>
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          {/* ===== IMAGES ===== */}
          <div className="row g-4">
            {[
              { key: "userImage", label: "Student Photo", icon: "bi-person" },
              { key: "fatherImage", label: "Father Photo", icon: "bi-person" },
              { key: "motherImage", label: "Mother Photo", icon: "bi-person" },
            ].map(({ key, label, icon }) => (
              <div className="col-md-4" key={key}>
                <div className="border rounded-4 p-3 bg-white h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="fw-semibold">
                      <i className={`bi ${icon} me-2 text-primary`}></i>
                      {label}
                    </div>

                    <span className="badge text-bg-light border text-dark rounded-pill">
                      Image
                    </span>
                  </div>

                  <div
                    className="rounded-4 border bg-light d-flex align-items-center justify-content-center overflow-hidden"
                    style={{ height: 220 }}
                  >
                    {previews[key] || imageUrls[key] ? (
                      <img
                        src={previews[key] || imageUrls[key]}
                        alt={label}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="text-center text-muted">
                        <i className="bi bi-image fs-1"></i>
                        <div className="small mt-1">No Photo</div>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-3">
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => handleImageChange(e, key)}
                      />
                      <small className="text-muted">
                        Upload JPG / PNG (max recommended 2MB)
                      </small>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="alert alert-light border rounded-4 small mt-4 mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Make sure details are correct. Wrong information may cause problems
            in documents and reports.
          </div>
        </div>
      </div>

      {/* ===== BASIC INFORMATION ===== */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-person-lines-fill text-primary me-2"></i>
            Basic Information
          </h5>

          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Admission Number</label>
              <input value={formData.campusId} className="form-control" disabled />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Student Name</label>
              <input value={formData.name} className="form-control" disabled />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Roll No</label>
              <input
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Class</label>
              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
                className="form-select"
                disabled={!isEditing}
              >
                <option value="">Select</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Email</label>
              <input value={formData.email} className="form-control" disabled />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">DOB</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
                disabled={!isEditing}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="form-select"
                disabled={!isEditing}
              >
                <option value="">Select</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ADDRESS ===== */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-geo-alt-fill text-primary me-2"></i>
            Address
          </h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Pincode</label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== PARENT DETAILS ===== */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-people-fill text-primary me-2"></i>
            Parent Details
          </h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Father Name</label>
              <input
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Father Phone</label>
              <input
                name="fatherPhone"
                value={formData.fatherPhone}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Father Occupation</label>
              <input
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Mother Name</label>
              <input
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Mother Phone</label>
              <input
                name="motherPhone"
                value={formData.motherPhone}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Mother Occupation</label>
              <input
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== GUARDIAN ===== */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-person-hearts text-primary me-2"></i>
            Guardian Details
          </h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Guardian Name</label>
              <input
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Relation</label>
              <input
                name="guardianRelation"
                value={formData.guardianRelation}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Guardian Phone</label>
              <input
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== DOCUMENTS ===== */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-file-earmark-text-fill text-primary me-2"></i>
            Documents
          </h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Aadhaar Number</label>
              <input
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="py-3"></div>
    </div>
  </div>
);
}

export default StuProfile;
