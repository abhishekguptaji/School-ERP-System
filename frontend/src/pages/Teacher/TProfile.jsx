import { useEffect, useState } from "react";
import {
  createOrUpdateTeacherProfile,
  getTeacherProfile,
} from "../../services/teacherService.js";
import "./css/TeacherProfile.css";

const DESIGNATION_MAP = {
  PRT: "Primary Teacher",
  TGT: "Trained Graduate Teacher",
  PGT: "Post Graduate Teacher",
};

function TProfile() {
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
  if (loading) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">Loading...</div>
        </div>
      </div>
    );
  }

  const statusBadge =
    form.status === "active"
      ? "bg-success"
      : form.status === "resigned"
      ? "bg-secondary"
      : form.status === "terminated"
      ? "bg-danger"
      : "bg-warning text-dark";

  return (
    <div className="container ">
      {/* TOP HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h3 className="fw-bold mb-0">Teacher Profile</h3>
        </div>

        <div className="d-flex gap-2">
          {!isEditing ? (
            <button
              className="btn btn-outline-dark rounded-3 fw-semibold"
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-pencil-square me-2"></i>
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="btn btn-dark rounded-3 fw-semibold"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Save
                  </>
                )}
              </button>

              <button
                className="btn btn-outline-secondary rounded-3 fw-semibold"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="alert alert-danger rounded-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success rounded-4">
          <i className="bi bi-check-circle me-2"></i>
          {successMsg}
        </div>
      )}

      <div className="row g-3">
        {/* LEFT PROFILE CARD */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="bg-dark text-white p-4">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-white text-dark rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48 }}
                >
                  <i className="bi bi-person-badge fs-4"></i>
                </div>

                <div>
                  <h5 className="mb-0 fw-semibold">My Profile</h5>
                  <small className="text-white-50">
                    Teacher account information
                  </small>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              <div className="text-center">
                <img
                  src={preview || "/default-user.png"}
                  alt="teacher"
                  className="rounded-circle shadow-sm"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    border: "4px solid #f1f1f1",
                  }}
                />

                {isEditing && (
                  <div className="mt-3">
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImage}
                    />
                  </div>
                )}

                <h5 className="fw-bold mt-3 mb-0">{user?.name || "-"}</h5>
                <small className="text-muted">{user?.email || "-"}</small>

                <div className="mt-3 d-flex justify-content-center gap-2 flex-wrap">
                  <span className="badge bg-primary px-3 py-2 rounded-pill">
                    {DESIGNATION_MAP[form.designation]}
                  </span>

                  <span className={`badge ${statusBadge} px-3 py-2 rounded-pill`}>
                    {form.status}
                  </span>
                </div>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <span className="text-muted">Employee ID</span>
                <span className="fw-semibold">{user?.campusId || "-"}</span>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span className="text-muted">Profile Created</span>
                <span className="fw-semibold">
                  {isProfileCreated ? "Yes" : "No"}
                </span>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span className="text-muted">Account Active</span>
                <span className="fw-semibold">
                  {form.isActive ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="col-lg-8">
          {/* PROFESSIONAL */}
          <div className="card border-0 shadow-sm rounded-4 mb-3">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-briefcase me-2"></i>
                  Professional Details
                </h5>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Designation</label>
                  {!isEditing ? (
                    <div className="form-control bg-light">
                      {DESIGNATION_MAP[form.designation]}
                    </div>
                  ) : (
                    <select
                      className="form-select"
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

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Department</label>
                  <input
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Science / Maths / English"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Date of Joining
                  </label>
                  <input
                    type={isEditing ? "date" : "text"}
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="dateOfJoining"
                    value={
                      isEditing
                        ? form.dateOfJoining
                        : form.dateOfJoining
                        ? new Date(form.dateOfJoining).toLocaleDateString()
                        : ""
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Employment Type
                  </label>
                  {!isEditing ? (
                    <input
                      className="form-control bg-light"
                      disabled
                      value={form.employmentType}
                    />
                  ) : (
                    <select
                      className="form-select"
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

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Qualification</label>
                  <input
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="experienceYears"
                    value={form.experienceYears}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Status</label>
                  {!isEditing ? (
                    <input
                      className="form-control bg-light"
                      disabled
                      value={form.status}
                    />
                  ) : (
                    <select
                      className="form-select"
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

                <div className="col-md-6">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isClassTeacher"
                      checked={form.isClassTeacher}
                      onChange={handleChange}
                      disabled={!isEditing}
                      id="isClassTeacher"
                    />
                    <label className="form-check-label" htmlFor="isClassTeacher">
                      I am a Class Teacher
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Class Teacher Of
                  </label>
                  <input
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing || !form.isClassTeacher}
                    name="classTeacherOf"
                    value={form.classTeacherOf}
                    onChange={handleChange}
                    placeholder="ex: 10-A"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PERSONAL */}
          <div className="card border-0 shadow-sm rounded-4 mb-3">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-person-heart me-2"></i>
                Personal Details
              </h5>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">DOB</label>
                  <input
                    type={isEditing ? "date" : "text"}
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="dob"
                    value={
                      isEditing
                        ? form.dob
                        : form.dob
                        ? new Date(form.dob).toLocaleDateString()
                        : ""
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Gender</label>
                  {!isEditing ? (
                    <input
                      className="form-control bg-light"
                      disabled
                      value={form.gender}
                    />
                  ) : (
                    <select
                      className="form-select"
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

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Blood Group</label>
                  {!isEditing ? (
                    <input
                      className="form-control bg-light"
                      disabled
                      value={form.bloodGroup}
                    />
                  ) : (
                    <select
                      className="form-select"
                      name="bloodGroup"
                      value={form.bloodGroup}
                      onChange={handleChange}
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        )
                      )}
                    </select>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Marital Status
                  </label>
                  {!isEditing ? (
                    <input
                      className="form-control bg-light"
                      disabled
                      value={form.maritalStatus}
                    />
                  ) : (
                    <select
                      className="form-select"
                      name="maritalStatus"
                      value={form.maritalStatus}
                      onChange={handleChange}
                    >
                      {["Single", "Married", "Divorced", "Widowed"].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Category</label>
                  {!isEditing ? (
                    <input
                      className="form-control bg-light"
                      disabled
                      value={form.category || "-"}
                    />
                  ) : (
                    <select
                      className="form-select"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {["General", "OBC", "SC", "ST", "EWS"].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT */}
          <div className="card border-0 shadow-sm rounded-4 mb-3">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-telephone me-2"></i>
                Contact Details
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Alternate Phone
                  </label>
                  <input
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="alternatePhone"
                    value={form.alternatePhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">City</label>
                  <input
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="address.city"
                    value={form.address.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">State</label>
                  <input
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="address.state"
                    value={form.address.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Pincode</label>
                  <input
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="address.pincode"
                    value={form.address.pincode}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Full Address</label>
                  <textarea
                    rows={2}
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="address.fullAddress"
                    value={form.address.fullAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* EMERGENCY */}
          <div className="card border-0 shadow-sm rounded-4 mb-3">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-exclamation-diamond me-2"></i>
                Emergency Contact
              </h5>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="emergencyContact.name"
                    value={form.emergencyContact.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Relation</label>
                  <input
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="emergencyContact.relation"
                    value={form.emergencyContact.relation}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    className={`form-control ${!isEditing ? "bg-light" : ""}`}
                    disabled={!isEditing}
                    name="emergencyContact.phone"
                    value={form.emergencyContact.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DOCUMENTS + BANK */}
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Documents
                  </h5>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Aadhaar</label>
                    <input
                      className={`form-control ${!isEditing ? "bg-light" : ""}`}
                      disabled={!isEditing}
                      name="documents.aadhaarNumber"
                      value={form.documents.aadhaarNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="form-label fw-semibold">PAN</label>
                    <input
                      className={`form-control ${!isEditing ? "bg-light" : ""}`}
                      disabled={!isEditing}
                      name="documents.panNumber"
                      value={form.documents.panNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-bank me-2"></i>
                    Bank Details
                  </h5>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Account Holder Name
                      </label>
                      <input
                        className={`form-control ${
                          !isEditing ? "bg-light" : ""
                        }`}
                        disabled={!isEditing}
                        name="bankDetails.accountHolderName"
                        value={form.bankDetails.accountHolderName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Account Number
                      </label>
                      <input
                        className={`form-control ${
                          !isEditing ? "bg-light" : ""
                        }`}
                        disabled={!isEditing}
                        name="bankDetails.accountNumber"
                        value={form.bankDetails.accountNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">IFSC</label>
                      <input
                        className={`form-control ${
                          !isEditing ? "bg-light" : ""
                        }`}
                        disabled={!isEditing}
                        name="bankDetails.ifscCode"
                        value={form.bankDetails.ifscCode}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Bank Name</label>
                      <input
                        className={`form-control ${
                          !isEditing ? "bg-light" : ""
                        }`}
                        disabled={!isEditing}
                        name="bankDetails.bankName"
                        value={form.bankDetails.bankName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Branch</label>
                      <input
                        className={`form-control ${
                          !isEditing ? "bg-light" : ""
                        }`}
                        disabled={!isEditing}
                        name="bankDetails.branch"
                        value={form.bankDetails.branch}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SPACE */}
          <div className="py-2"></div>
        </div>
      </div>
    </div>
  );
}

export default TProfile;