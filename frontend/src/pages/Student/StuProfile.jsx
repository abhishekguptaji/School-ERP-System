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

      if (imageFiles.userImage) payload.append("userImage", imageFiles.userImage);
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
        text: "Profile Saved Successfully",
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
    <div className="stuProfilePage">
      <div className="container-fluid stuProfileContainer">
        {/* ===== HEADER ===== */}
        <div className="stuProfileHeader d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="mb-1">
              Student Profile
            </h3>
          </div>

          {/* Actions */}
          {!isEditing ? (
            <button
              type="button"
              className="btn btn-dark px-4"
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-pencil-square me-2"></i>
              Edit Profile
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => setIsEditing(false)}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-success px-4"
                onClick={handleSave}
              >
                <i className="bi bi-check2-circle me-2"></i>
                Save
              </button>
            </div>
          )}
        </div>

        {/* ===== TOP PROFILE CARD ===== */}
        <div className="card stuTopCard mb-4">
          <div className="stuTopCardHeader">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="stuAvatarIcon">
                  <i className="bi bi-person-fill"></i>
                </div>

                <div>
                  <div className="stuName">{formData.name || "Student"}</div>
                  <div className="stuEmail">{formData.email || "No email"}</div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <span className="stuBadge">
                  <i className="bi bi-upc-scan me-2"></i>
                  Campus ID: <b>{formData.campusId || "N/A"}</b>
                </span>

                <span className="stuBadge">
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
                  <div className="stuImageCard h-100">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="stuImageTitle">
                        <i className={`bi ${icon} me-2 text-primary`}></i>
                        {label}
                      </div>

                      <span className="badge text-bg-light border text-dark rounded-pill">
                        Image
                      </span>
                    </div>

                    <div className="stuImageBox d-flex align-items-center justify-content-center">
                      {previews[key] || imageUrls[key] ? (
                        <img
                          src={previews[key] || imageUrls[key]}
                          alt={label}
                        />
                      ) : (
                        <div className="text-center stuNoPhoto">
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
                          Upload JPG / PNG 
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== BASIC INFORMATION ===== */}
        <div className="card stuCard mb-4">
          <div className="card-body">
            <h5>
              <i className="bi bi-person-lines-fill text-primary me-2"></i>
              Basic Information
            </h5>

            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Admission Number</label>
                <input
                  value={formData.campusId}
                  className="form-control"
                  disabled
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Student Name</label>
                <input value={formData.name} className="form-control" disabled />
              </div>

              <div className="col-md-3">
                <label className="form-label">Roll No</label>
                <input
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Class</label>
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
                <label className="form-label">Email</label>
                <input
                  value={formData.email}
                  className="form-control"
                  disabled
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">DOB</label>
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
                <label className="form-label">Gender</label>
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
                <label className="form-label">Blood Group</label>
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
        <div className="card stuCard mb-4">
          <div className="card-body">
            <h5>
              <i className="bi bi-geo-alt-fill text-primary me-2"></i>
              Address
            </h5>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">State</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Pincode</label>
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
        <div className="card stuCard mb-4">
          <div className="card-body">
            <h5>
              <i className="bi bi-people-fill text-primary me-2"></i>
              Parent Details
            </h5>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Father Name</label>
                <input
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Father Phone</label>
                <input
                  name="fatherPhone"
                  value={formData.fatherPhone}
                  onChange={handleChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Father Occupation</label>
                <input
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Mother Name</label>
                <input
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Mother Phone</label>
                <input
                  name="motherPhone"
                  value={formData.motherPhone}
                  onChange={handleChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Mother Occupation</label>
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
        <div className="card stuCard mb-4">
          <div className="card-body">
            <h5>
              <i className="bi bi-person-hearts text-primary me-2"></i>
              Guardian Details
            </h5>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Guardian Name</label>
                <input
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Relation</label>
                <input
                  name="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={handleChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Guardian Phone</label>
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
        <div className="card stuCard mb-4">
          <div className="card-body">
            <h5>
              <i className="bi bi-file-earmark-text-fill text-primary me-2"></i>
              Documents
            </h5>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Aadhaar Number</label>
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

        <div style={{ height: 10 }}></div>
      </div>
    </div>
  );
}

export default StuProfile;