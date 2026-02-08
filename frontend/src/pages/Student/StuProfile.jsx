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
    return <h3 style={{ padding: "20px" }}>Loading...</h3>;
  }

  return (
    <div className="container-fluid px-4 mt-3 stu-bg">
      <div className="profile-card-full p-4 shadow-sm">
        {/* ===== HEADER ===== */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Student Profile</h4>

          {!isEditing ? (
            <button
              type="button"
              className="btn btn-edit"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <div>
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* ===== IMAGES ===== */}
        <div className="row text-center mb-4">
          {[
            { key: "userImage", label: "Student Photo" },
            { key: "fatherImage", label: "Father Photo" },
            { key: "motherImage", label: "Mother Photo" },
          ].map(({ key, label }) => (
            <div className="col-md-4" key={key}>
              <div className="image-box">
                <div className="image-preview">
                  {previews[key] || imageUrls[key] ? (
                    <img src={previews[key] || imageUrls[key]} alt={label} />
                  ) : (
                    <span>No Photo</span>
                  )}
                </div>

                <p className="image-label">{label}</p>

                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => handleImageChange(e, key)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ===== BASIC ===== */}
        <fieldset className="mb-3">
          <legend>Basic Information</legend>

          <div className="row g-3">

            <div className="col-md-3">
              <label>Admission Number</label>
              <input
                value={formData.campusId}
                className="form-control"
                disabled
              />
            </div>
            

            <div className="col-md-3">
              <label>Student Name</label>
              <input value={formData.name} className="form-control" disabled />
            </div>
            
            <div className="col-md-3">
              <label>Roll No</label>
              <input
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
            

            <div className="col-md-3">
              <label>Class</label>
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
              <label>Email</label>
              <input value={formData.email} className="form-control" disabled />
            </div>

            <div className="col-md-3">
              <label>DOB</label>
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
              <label>Gender</label>
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
              <label>Blood Group</label>
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
        </fieldset>

        {/* ===== ADDRESS ===== */}
        <fieldset className="mb-3">
          <legend>Address</legend>

          <div className="row g-3">
            <div className="col-md-4">
              <label>City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label>State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label>Pincode</label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
          </div>
        </fieldset>

        {/* ===== PARENTS ===== */}
        <fieldset className="mb-3">
          <legend>Parent Details</legend>

          <div className="row g-3">
            <div className="col-md-4">
              <label>Father Name</label>
              <input
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label>Father Phone</label>
              <input
                name="fatherPhone"
                value={formData.fatherPhone}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label>Father Occupation</label>
              <input
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label>Mother Name</label>
              <input
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label>Mother Phone</label>
              <input
                name="motherPhone"
                value={formData.motherPhone}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label>Mother Occupation</label>
              <input
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
          </div>
        </fieldset>

        {/* ===== GUARDIAN ===== */}
        <fieldset className="mb-3">
          <legend>Guardian Details</legend>

          <div className="row g-3">
            <div className="col-md-4">
              <label>Guardian Name</label>
              <input
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label>Relation</label>
              <input
                name="guardianRelation"
                value={formData.guardianRelation}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="col-md-4">
              <label>Guardian Phone</label>
              <input
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
          </div>
        </fieldset>

        {/* ===== DOCUMENTS ===== */}
        <fieldset className="mb-3">
          <legend>Documents</legend>

          <div className="row g-3">
            <div className="col-md-4">
              <label>Aadhaar Number</label>
              <input
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default StuProfile;
