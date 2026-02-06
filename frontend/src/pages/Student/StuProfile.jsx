import { useState } from "react";
import "./css/StuProfile.css";

function StuProfile() {
  const [isEditing, setIsEditing] = useState(false);

  /* ================= FORM DATA (EXACT SCHEMA MATCH) ================= */
  const [formData, setFormData] = useState({
    admissionNumber: "",
    user:"",
    rollNo: "",
    className: "",
    email:"",
    dob: "",
    gender: "",
    bloodGroup: "",

    address: {
      city: "",
      state: "",
      pincode: "",
    },

    father: {
      name: "",
      phone: "",
      occupation: "",
    },

    mother: {
      name: "",
      phone: "",
      occupation: "",
    },

    guardian: {
      name: "",
      relation: "",
      phone: "",
    },

    documents: {
      aadhaarNumber: "",
    },
  });

  /* ================= IMAGE STATE ================= */
  const [images, setImages] = useState({
    userImage: null,
    fatherImage: null,
    motherImage: null,
  });

  const [preview, setPreview] = useState({
    userImage: null,
    fatherImage: null,
    motherImage: null,
  });

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setImages((prev) => ({ ...prev, [key]: file }));
    setPreview((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handleSave = () => {
    const payload = new FormData();

    payload.append("userImage", images.userImage);
    payload.append("fatherImage", images.fatherImage);
    payload.append("motherImage", images.motherImage);
    payload.append("data", JSON.stringify(formData));

    console.log("FORM DATA:", formData);
    console.log("IMAGES:", images);

    setIsEditing(false);
    // 👉 axios.post("/student-profile", payload)
  };

  /* ================= UI ================= */

  return (
    <div className="container-fluid px-4 mt-3 stu-bg">
      <div className="profile-card-full p-4 shadow-sm">

        {/* ===== HEADER ===== */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Student Profile</h4>

          {!isEditing ? (
            <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          ) : (
            <div>
              <button className="btn btn-secondary me-2" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
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
                  {preview[key] ? <img src={preview[key]} alt="" /> : <span>No Photo</span>}
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
        <fieldset>
          <legend>Basic Information</legend>
          <div className="row g-3">
            <div className="col-md-3">
              <label>Admission Number</label>
              <input name="admissionNumber" value={formData.admissionNumber} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>

            <div className="col-md-3">
              <label>Student's Name</label>
              <input name="user_name" value={formData.name} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>

            <div className="col-md-3">
              <label>Roll No</label>
              <input name="rollNo" value={formData.rollNo} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>

            <div className="col-md-3">
              <label>Class</label>
              <select name="className" value={formData.className} onChange={handleChange} className="form-select" disabled={!isEditing}>
                <option value="">Select</option>
                <option value="1">1th</option><option value="2">2nd</option>
                <option value="3">3rd</option><option value="4">4th</option>
                <option value="5">5th</option><option value="6">6th</option>
                <option value="7">7th</option><option value="8">8th</option>
                <option value="9">9th</option><option value="10">10th</option>
                <option value="11">11th</option><option value="12">12th</option>
                
              </select>
            </div>
            
            <div className="col-md-3">
              <label>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>

            <div className="col-md-3">
              <label>DOB</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>

            <div className="col-md-3">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="form-select" disabled={!isEditing}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="form-select" disabled={!isEditing}>
                <option value="">Select</option>
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option>
                <option>AB+</option><option>AB-</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* ===== ADDRESS ===== */}
        <fieldset>
          <legend>Address</legend>
          <div className="row g-3">
            <div className="col-md-4">
              <label>Town & City</label>
              <input name="address.city" value={formData.address.city} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
            <div className="col-md-4">
              <label>State</label>
              <input name="address.state" value={formData.address.state} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
            <div className="col-md-4">
              <label>Pincode</label>
              <input name="address.pincode" value={formData.address.pincode} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
          </div>
        </fieldset>

        {/* ===== PARENTS ===== */}
        <fieldset>
          <legend>Parent Details</legend>
          <div className="row g-3">
            <div className="col-md-4">
              <label>Father Name</label>
              <input name="father.name" value={formData.father.name} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
            <div className="col-md-4">
              <label>Father Phone</label>
              <input name="father.phone" value={formData.father.phone} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
            <div className="col-md-4">
              <label>Father Occupation</label>
              <input name="father.occupation" value={formData.father.occupation} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>

            <div className="col-md-4">
              <label>Mother Name</label>
              <input name="mother.name" value={formData.mother.name} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
            <div className="col-md-4">
              <label>Mother Phone</label>
              <input name="mother.phone" value={formData.mother.phone} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
            <div className="col-md-4">
              <label>Mother Occupation</label>
              <input name="mother.occupation" value={formData.mother.occupation} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
          </div>
        </fieldset>

        {/* ===== GUARDIAN ===== */}
        <fieldset>
          <legend>Guardian Details</legend>
          <div className="row g-3">
            <div className="col-md-4">
              <label>Guardian Name</label>
              <input name="guardian.name" value={formData.guardian.name} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
            <div className="col-md-4">
              <label>Relation</label>
              <input name="guardian.relation" value={formData.guardian.relation} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
            <div className="col-md-4">
              <label>Guardian Phone</label>
              <input name="guardian.phone" value={formData.guardian.phone} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
          </div>
        </fieldset>

        {/* ===== DOCUMENTS ===== */}
        <fieldset>
          <legend>Documents</legend>
          <div className="row g-3">
            <div className="col-md-4">
              <label>Aadhaar Number</label>
              <input name="documents.aadhaarNumber" value={formData.documents.aadhaarNumber} onChange={handleChange} className="form-control" disabled={!isEditing} />
            </div>
          </div>
        </fieldset>

      </div>
    </div>
  );
}

export default StuProfile;
