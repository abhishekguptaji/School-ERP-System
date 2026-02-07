import { useEffect, useState } from "react";
import {
  createOrUpdateTeacherProfile,
  getTeacherProfile,
} from "../../services/authService.js";
import "./css/TeacherProfile.css";

const DESIGNATION_MAP = {
  PRT: "Primary Teacher",
  TGT: "Trained Graduate Teacher",
  PGT: "Post Graduate Teacher",
};

function TeacherProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [user, setUser] = useState(null);
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [teacherImageFile, setTeacherImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    status: "active",
    isActive: true,

    designation: "PRT",
    department: "",
    dateOfJoining: "",
    employmentType: "Permanent",
    qualification: "",
    experienceYears: 0,

    isClassTeacher: false,
    classTeacherOf: "",

    dob: "",
    gender: "Male",
    bloodGroup: "O+",
    maritalStatus: "Single",
    category: "",

    phone: "",
    alternatePhone: "",

    address: {
      city: "",
      state: "",
      pincode: "",
      fullAddress: "",
    },

    emergencyContact: {
      name: "",
      relation: "",
      phone: "",
    },

    documents: {
      aadhaarNumber: "",
      panNumber: "",
    },

    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branch: "",
    },
  });

  /* ================= LOAD PROFILE ================= */
  const loadProfile = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");

    const res = await getTeacherProfile();

    if (!res?.success) {
      setError(res?.message || "Failed to fetch teacher profile");
      setLoading(false);
      return;
    }

    setUser(res?.data?.user || null);
    setIsProfileCreated(res?.data?.isProfileCreated || false);

    const profile = res?.data?.profile;

    // If profile not created -> auto edit mode
    if (!profile) {
      setIsEditing(true);
      setPreview("");
      setLoading(false);
      return;
    }

    setForm({
      status: profile.status || "active",
      isActive: profile.isActive ?? true,

      designation: profile.designation || "PRT",
      department: profile.department || "",
      dateOfJoining: profile.dateOfJoining
        ? profile.dateOfJoining.slice(0, 10)
        : "",
      employmentType: profile.employmentType || "Permanent",
      qualification: profile.qualification || "",
      experienceYears: profile.experienceYears || 0,

      isClassTeacher: profile.isClassTeacher ?? false,
      classTeacherOf: profile.classTeacherOf || "",

      dob: profile.dob ? profile.dob.slice(0, 10) : "",
      gender: profile.gender || "Male",
      bloodGroup: profile.bloodGroup || "O+",
      maritalStatus: profile.maritalStatus || "Single",
      category: profile.category || "",

      phone: profile.phone || "",
      alternatePhone: profile.alternatePhone || "",

      address: {
        city: profile.address?.city || "",
        state: profile.address?.state || "",
        pincode: profile.address?.pincode || "",
        fullAddress: profile.address?.fullAddress || "",
      },

      emergencyContact: {
        name: profile.emergencyContact?.name || "",
        relation: profile.emergencyContact?.relation || "",
        phone: profile.emergencyContact?.phone || "",
      },

      documents: {
        aadhaarNumber: profile.documents?.aadhaarNumber || "",
        panNumber: profile.documents?.panNumber || "",
      },

      bankDetails: {
        accountHolderName: profile.bankDetails?.accountHolderName || "",
        accountNumber: profile.bankDetails?.accountNumber || "",
        ifscCode: profile.bankDetails?.ifscCode || "",
        bankName: profile.bankDetails?.bankName || "",
        branch: profile.bankDetails?.branch || "",
      },
    });

    setPreview(profile.teacherImage || "");
    setIsEditing(false);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
      return;
    }

    if (name.startsWith("emergencyContact.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [key]: value },
      }));
      return;
    }

    if (name.startsWith("documents.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        documents: { ...prev.documents, [key]: value },
      }));
      return;
    }

    if (name.startsWith("bankDetails.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        bankDetails: { ...prev.bankDetails, [key]: value },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTeacherImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccessMsg("");

    // required validations
    if (!form.department?.trim()) {
      setError("Department is required");
      setSaving(false);
      return;
    }
    if (!form.dateOfJoining) {
      setError("Date of Joining is required");
      setSaving(false);
      return;
    }
    if (!form.phone?.trim()) {
      setError("Phone is required");
      setSaving(false);
      return;
    }
    if (form.isClassTeacher && !form.classTeacherOf?.trim()) {
      setError("Class Teacher Of is required");
      setSaving(false);
      return;
    }

    const fd = new FormData();
    fd.append("data", JSON.stringify(form));

    if (teacherImageFile) {
      fd.append("teacherImage", teacherImageFile);
    }

    const res = await createOrUpdateTeacherProfile(fd);

    if (!res?.success) {
      setError(res?.message || "Failed to save profile");
      setSaving(false);
      return;
    }

    setSuccessMsg("Teacher profile saved successfully!");
    setSaving(false);
    setIsEditing(false);
    setTeacherImageFile(null);

    loadProfile();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTeacherImageFile(null);
    setSuccessMsg("");
    setError("");
    loadProfile();
  };

  /* ================= UI ================= */
  if (loading) return <div className="tp-loading">Loading...</div>;

  return (
    <div className="tp-container">
      {/* HEADER */}
      <div className="tp-header">
        <h2 className="tp-title">Teacher Profile</h2>

        <div className="tp-actions">
          {!isEditing ? (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          ) : (
            <>
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                className="btn-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className="tp-error">{error}</div>}
      {successMsg && <div className="tp-success">{successMsg}</div>}

      {/* TOP CARD (IMAGE + NAME/EMAIL/EMPLOYEEID) */}
      <div className="tp-topCard">
        <div className="tp-topLeft">
          <img
            className="tp-topImg"
            src={preview || "/default-user.png"}
            alt="teacher"
          />

          {isEditing && (
            <input type="file" accept="image/*" onChange={handleImage} />
          )}
        </div>

        <div className="tp-topRight">
          <h3 className="tp-topName">{user?.name || "-"}</h3>

          <p>
            <b>Email:</b> {user?.email || "-"}
          </p>

          <p>
            <b>Employee ID:</b> {user?.employeeId || "-"}
          </p>

          <p>
            <b>Profile Created:</b> {isProfileCreated ? " Yes" : " No"}
          </p>
        </div>
      </div>

      {/* FULL DETAILS CARD */}
      <div className="tp-card">
        <div className="tp-right">
          {/* PROFESSIONAL */}
          <div className="tp-sectionTitle">Professional Details</div>

          <div className="tp-grid">
            <div className="tp-field">
              <label>Designation</label>
              {!isEditing ? (
                <p>{DESIGNATION_MAP[form.designation]}</p>
              ) : (
                <select
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                >
                  <option value="PRT">PRT - Primary Teacher</option>
                  <option value="TGT">TGT - Trained Graduate Teacher</option>
                  <option value="PGT">PGT - Post Graduate Teacher</option>
                </select>
              )}
            </div>

            <div className="tp-field">
              <label>Department</label>
              {!isEditing ? (
                <p>{form.department || "-"}</p>
              ) : (
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Science / Maths / English"
                />
              )}
            </div>

            <div className="tp-field">
              <label>Date of Joining</label>
              {!isEditing ? (
                <p>
                  {form.dateOfJoining
                    ? new Date(form.dateOfJoining).toLocaleDateString()
                    : "-"}
                </p>
              ) : (
                <input
                  type="date"
                  name="dateOfJoining"
                  value={form.dateOfJoining}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Employment Type</label>
              {!isEditing ? (
                <p>{form.employmentType}</p>
              ) : (
                <select
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                >
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Guest">Guest</option>
                  <option value="Part-time">Part-time</option>
                </select>
              )}
            </div>

            <div className="tp-field">
              <label>Qualification</label>
              {!isEditing ? (
                <p>{form.qualification || "-"}</p>
              ) : (
                <input
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Experience (Years)</label>
              {!isEditing ? (
                <p>{form.experienceYears ?? 0}</p>
              ) : (
                <input
                  type="number"
                  min={0}
                  name="experienceYears"
                  value={form.experienceYears}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Status</label>
              {!isEditing ? (
                <p>{form.status}</p>
              ) : (
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="resigned">Resigned</option>
                  <option value="terminated">Terminated</option>
                  <option value="onLeave">On Leave</option>
                </select>
              )}
            </div>

            <div className="tp-field">
              <label>Active Account</label>
              {!isEditing ? (
                <p>{form.isActive ? "Yes" : "No"}</p>
              ) : (
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Class Teacher?</label>
              {!isEditing ? (
                <p>{form.isClassTeacher ? "Yes" : "No"}</p>
              ) : (
                <input
                  type="checkbox"
                  name="isClassTeacher"
                  checked={form.isClassTeacher}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Class Teacher Of</label>
              {!isEditing ? (
                <p>{form.classTeacherOf || "-"}</p>
              ) : (
                <input
                  name="classTeacherOf"
                  value={form.classTeacherOf}
                  onChange={handleChange}
                  placeholder="ex: 10-A"
                  disabled={!form.isClassTeacher}
                />
              )}
            </div>
          </div>

          {/* PERSONAL */}
          <div className="tp-sectionTitle">Personal Details</div>

          <div className="tp-grid">
            <div className="tp-field">
              <label>DOB</label>
              {!isEditing ? (
                <p>
                  {form.dob ? new Date(form.dob).toLocaleDateString() : "-"}
                </p>
              ) : (
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Gender</label>
              {!isEditing ? (
                <p>{form.gender}</p>
              ) : (
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              )}
            </div>

            <div className="tp-field">
              <label>Blood Group</label>
              {!isEditing ? (
                <p>{form.bloodGroup}</p>
              ) : (
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              )}
            </div>

            <div className="tp-field">
              <label>Marital Status</label>
              {!isEditing ? (
                <p>{form.maritalStatus}</p>
              ) : (
                <select
                  name="maritalStatus"
                  value={form.maritalStatus}
                  onChange={handleChange}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              )}
            </div>

            <div className="tp-field">
              <label>Category</label>
              {!isEditing ? (
                <p>{form.category || "-"}</p>
              ) : (
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              )}
            </div>
          </div>

          {/* CONTACT */}
          <div className="tp-sectionTitle">Contact Details</div>

          <div className="tp-grid">
            <div className="tp-field">
              <label>Phone</label>
              {!isEditing ? (
                <p>{form.phone || "-"}</p>
              ) : (
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Alternate Phone</label>
              {!isEditing ? (
                <p>{form.alternatePhone || "-"}</p>
              ) : (
                <input
                  name="alternatePhone"
                  value={form.alternatePhone}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>City</label>
              {!isEditing ? (
                <p>{form.address.city || "-"}</p>
              ) : (
                <input
                  name="address.city"
                  value={form.address.city}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>State</label>
              {!isEditing ? (
                <p>{form.address.state || "-"}</p>
              ) : (
                <input
                  name="address.state"
                  value={form.address.state}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Pincode</label>
              {!isEditing ? (
                <p>{form.address.pincode || "-"}</p>
              ) : (
                <input
                  name="address.pincode"
                  value={form.address.pincode}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Full Address</label>
              {!isEditing ? (
                <p>{form.address.fullAddress || "-"}</p>
              ) : (
                <input
                  name="address.fullAddress"
                  value={form.address.fullAddress}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>

          {/* EMERGENCY */}
          <div className="tp-sectionTitle">Emergency Contact</div>

          <div className="tp-grid">
            <div className="tp-field">
              <label>Name</label>
              {!isEditing ? (
                <p>{form.emergencyContact.name || "-"}</p>
              ) : (
                <input
                  name="emergencyContact.name"
                  value={form.emergencyContact.name}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Relation</label>
              {!isEditing ? (
                <p>{form.emergencyContact.relation || "-"}</p>
              ) : (
                <input
                  name="emergencyContact.relation"
                  value={form.emergencyContact.relation}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Phone</label>
              {!isEditing ? (
                <p>{form.emergencyContact.phone || "-"}</p>
              ) : (
                <input
                  name="emergencyContact.phone"
                  value={form.emergencyContact.phone}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>

          {/* DOCUMENTS */}
          <div className="tp-sectionTitle">Documents</div>

          <div className="tp-grid">
            <div className="tp-field">
              <label>Aadhaar</label>
              {!isEditing ? (
                <p>{form.documents.aadhaarNumber || "-"}</p>
              ) : (
                <input
                  name="documents.aadhaarNumber"
                  value={form.documents.aadhaarNumber}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>PAN</label>
              {!isEditing ? (
                <p>{form.documents.panNumber || "-"}</p>
              ) : (
                <input
                  name="documents.panNumber"
                  value={form.documents.panNumber}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>

          {/* BANK */}
          <div className="tp-sectionTitle">Bank Details</div>

          <div className="tp-grid">
            <div className="tp-field">
              <label>Account Holder</label>
              {!isEditing ? (
                <p>{form.bankDetails.accountHolderName || "-"}</p>
              ) : (
                <input
                  name="bankDetails.accountHolderName"
                  value={form.bankDetails.accountHolderName}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Account Number</label>
              {!isEditing ? (
                <p>{form.bankDetails.accountNumber || "-"}</p>
              ) : (
                <input
                  name="bankDetails.accountNumber"
                  value={form.bankDetails.accountNumber}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>IFSC</label>
              {!isEditing ? (
                <p>{form.bankDetails.ifscCode || "-"}</p>
              ) : (
                <input
                  name="bankDetails.ifscCode"
                  value={form.bankDetails.ifscCode}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Bank Name</label>
              {!isEditing ? (
                <p>{form.bankDetails.bankName || "-"}</p>
              ) : (
                <input
                  name="bankDetails.bankName"
                  value={form.bankDetails.bankName}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="tp-field">
              <label>Branch</label>
              {!isEditing ? (
                <p>{form.bankDetails.branch || "-"}</p>
              ) : (
                <input
                  name="bankDetails.branch"
                  value={form.bankDetails.branch}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
