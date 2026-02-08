import { useEffect, useState } from "react";
import {
  getShortProfileStudent,
  createApplyForm,
  getMyApplyForms,
} from "../../services/authService.js";
import { Link } from "react-router-dom";
import "./css/ApplyForm.css";
import Swal from "sweetalert2";
function ApplyForm() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fileKey, setFileKey] = useState(Date.now());

  const [student, setStudent] = useState(null);
  const [applyForm, setapplyForm] = useState([]); // store array directly
  const [error, setError] = useState("");

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };
  
  const [formData, setFormData] = useState({
    applyDate: getTodayDate(),
    formType: "",
    reason: "",
    attachment: null,
  });

  // ================= FETCH PROFILE + FORMS =================
  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getShortProfileStudent();
      const resForms = await getMyApplyForms();

      if (!res?.success) {
        setError(res?.message || "Failed to load student data");
        return;
      }

      if (!resForms?.success) {
        setError(resForms?.message || "Failed to load apply form");
        return;
      }

      setStudent(res?.data);

      setapplyForm(resForms?.data || []);
    } catch (err) {
      console.log(err);
      setError("Something went wrong while loading data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  // ================= INPUT HANDLERS =================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      attachment: e.target.files[0],
    }));
  };

  // ================= SUBMIT APPLY FORM =================
  const handleApplyForm = async () => {
    try {
      if (!formData.applyDate) return alert("Please select date");
      if (!formData.formType) return alert("Please select form type");
      if (!formData.reason.trim()) return alert("Please enter reason");

      setSubmitting(true);

      const fd = new FormData();
      fd.append("applyDate", formData.applyDate);
      fd.append("formType", formData.formType);
      fd.append("reason", formData.reason);

      if (formData.attachment) {
        fd.append("attachment", formData.attachment);
      }

      const res = await createApplyForm(fd);

      if (!res?.success) {
        alert(res?.message || "Failed to submit form");
        return;
      }

      // Refresh forms list after submit
      const resForms = await getMyApplyForms();
      if (resForms?.success) {
        setapplyForm(resForms?.data || []);
      }

      setFormData({
        applyDate: getTodayDate(),
        formType: "",
        reason: "",
        attachment: null,
      });
      setFileKey(Date.now());
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Form Apply Successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="dash-loading">Loading student dashboard...</div>;
  }

  if (error) {
    return (
      <div className="dash-error">
        <h3>Complete The Profile First</h3>
        <p>{error}</p>
        <Link className="myProfileBtn" to="/student/stu-profile">
          My Profile
        </Link>
      </div>
    );
  }

  const user = student?.user;
  const applydata = applyForm || [];

  // ================= MAIN UI =================
  return (
    <div className="container py-2">
      {/* PROFILE CARD */}
      <div className="row">
        <div className="col-12">
          <div className="erpProfileCard">
            <div className="row g-0 align-items-center">
              <div className="col-12 col-md-3 d-flex justify-content-center p-3">
                <img
                  className="erpProfileImg"
                  src={student?.userImage || "/default-user.png"}
                  alt="student"
                />
              </div>

              <div className="col-12 col-md-9 p-3">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <div className="erpInfoBox">
                      <p className="erpLabel">Name</p>
                      <p className="erpValue">{user?.name || "-"}</p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <div className="erpInfoBox">
                      <p className="erpLabel">Email</p>
                      <p className="erpValue">{user?.email || "-"}</p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <div className="erpInfoBox">
                      <p className="erpLabel">Campus ID</p>
                      <p className="erpValue">{user?.campusId || "-"}</p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="erpInfoBox">
                      <p className="erpLabel">Father Mobile</p>
                      <p className="erpValue">
                        {student?.father?.phone || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* END RIGHT */}
            </div>
          </div>
        </div>
      </div>

      {/* APPLY FORM CARD */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="erpFormCard">
            <h5 className="erpFormTitle text-center">Apply New Form</h5>

            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label erpLabel">Date</label>
                <input
                  type="date"
                  className="form-control erpInput"
                  name="applyDate"
                  value={formData.applyDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label erpLabel">Type</label>
                <select
                  className="form-select erpInput"
                  name="formType"
                  value={formData.formType}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="LEAVE">LEAVE</option>
                  <option value="BONAFIDE">BONAFIDE</option>
                  <option value="TC">TC</option>
                  <option value="CHARACTER_CERTIFICATE">
                    CHARACTER CERTIFICATE
                  </option>
                  <option value="FEE_CONCESSION">FEE CONCESSION</option>
                  <option value="TRANSPORT">TRANSPORT</option>
                  <option value="SUBJECT_CHANGE">SUBJECT CHANGE</option>
                  <option value="COMPLAINT">COMPLAINT</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label erpLabel">Attachment</label>
                <input
                  type="file"
                  key={fileKey}
                  className="form-control erpInput"
                  onChange={handleFileChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label erpLabel">Reason</label>
                <textarea
                  rows="3"
                  className="form-control erpInput"
                  placeholder="Write your reason..."
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12 d-flex justify-content-center">
                <button
                  type="button"
                  className="btn erpApplyBtn px-5"
                  onClick={handleApplyForm}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "APPLY"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="row px-4 mt-4">
        <div className="col-12">
          <div className="applyFormTable">
            {/* HEADER */}
            <div className="row headerRow m-0">
              <div className="col">
                <h4>Form Type</h4>
              </div>
              <div className="col">
                <h4>Apply Date</h4>
              </div>
              <div className="col">
                <h4>Reason</h4>
              </div>
              <div className="col">
                <h4>Status</h4>
              </div>
              <div className="col">
                <h4>Attachment</h4>
              </div>
            </div>

            {/* BODY */}
            {applydata?.length === 0 ? (
              <div className="row bodyRow m-0">
                <div className="col text-center py-3">
                  <p className="m-0">No forms submitted yet.</p>
                </div>
              </div>
            ) : (
              applydata.map((item) => (
                <div
                  className="row bodyRow m-0 align-items-center"
                  key={item._id}
                >
                  <div className="col fw-semibold">{item?.formType || "-"}</div>

                  <div className="col">
                    {item?.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </div>

                  <div className="col reasonCol" title={item?.reason || ""}>
                    {item?.reason || "-"}
                  </div>

                  <div className="col">
                    <span
                      className={`statusBadge ${item?.status || "Pending"}`}
                    >
                      {item?.status || "PENDING"}
                    </span>
                  </div>

                  <div className="col">
                    {item?.attachment ? (
                      <a
                        className="attachBtn"
                        href={item.attachment}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyForm;
