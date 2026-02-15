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
  const [applyForm, setapplyForm] = useState([]);
  const [error, setError] = useState("");

  const getTodayDate = () => new Date().toISOString().split("T")[0];

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

      if (formData.attachment) fd.append("attachment", formData.attachment);

      const res = await createApplyForm(fd);

      if (!res?.success) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res?.message || "Failed to submit form",
        });
        return;
      }

      const resForms = await getMyApplyForms();
      if (resForms?.success) setapplyForm(resForms?.data || []);

      setFormData({
        applyDate: getTodayDate(),
        formType: "",
        reason: "",
        attachment: null,
      });

      setFileKey(Date.now());

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Form Applied Successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ================= UI STATES =================
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <div className="mt-2 fw-semibold">Loading Apply Forms...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applyErrorWrap">
        <div className="applyErrorCard">
          <div className="applyErrorIcon">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>

          <h4 className="fw-bold mb-1">Complete The Profile First</h4>
          <p className="text-muted mb-3">{error}</p>

          <Link className="applyProfileBtn" to="/student/stu-profile">
            <i className="bi bi-person-badge me-2"></i>
            My Profile
          </Link>
        </div>
      </div>
    );
  }

  const user = student?.user;
  const applydata = applyForm || [];

  // ================= MAIN UI =================
  return (
    <div className="applyPage">
      <div className="container-fluid applyContainer">
        {/* PAGE HEADER */}
        <div className="applyHeader d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="mb-1">
              
              Apply Forms
            </h3>
            <div className="text-muted">
              Apply for leave, TC, certificates, transport, etc.
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-dark px-4"
            onClick={fetchStudent}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="card applyTopCard mb-4">
          <div className="applyTopCardHeader">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="applyAvatar">
                  <img
                    src={student?.userImage || "/default-user.png"}
                    alt="student"
                  />
                </div>

                <div>
                  <div className="applyName">{user?.name || "-"}</div>
                  <div className="applyEmail">{user?.email || "-"}</div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <span className="applyBadge">
                  <i className="bi bi-upc-scan me-2"></i>
                  Campus ID: <b>{user?.campusId || "-"}</b>
                </span>

                <span className="applyBadge">
                  <i className="bi bi-telephone-fill me-2"></i>
                  Father: <b>{student?.father?.phone || "-"}</b>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* APPLY FORM CARD */}
        <div className="card applyCard mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <h5 className="mb-0">
                <i className="bi bi-pencil-square text-primary me-2"></i>
                Apply New Form
              </h5>

              <span className="badge text-bg-light border text-dark rounded-pill px-3 py-2">
                <i className="bi bi-paperclip me-2"></i>
                Optional attachment
              </span>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label">Apply Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="applyDate"
                  value={formData.applyDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Form Type</label>
                <select
                  className="form-select"
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
                <label className="form-label">Attachment</label>
                <input
                  type="file"
                  key={fileKey}
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Reason</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Write your reason..."
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-primary px-5 py-2 fw-semibold"
                onClick={handleApplyForm}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-fill me-2"></i>
                    Apply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="card applyCard">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <h5 className="mb-0">
                <i className="bi bi-list-check text-primary me-2"></i>
                My Applied Forms
              </h5>

              <span className="badge text-bg-light border text-dark rounded-pill px-3 py-2">
                Total: <b>{applydata?.length || 0}</b>
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle applyTable">
                <thead>
                  <tr>
                    <th>Form Type</th>
                    <th>Apply Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th className="text-end">Attachment</th>
                  </tr>
                </thead>

                <tbody>
                  {applydata?.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        <i className="bi bi-info-circle me-2"></i>
                        No forms submitted yet.
                      </td>
                    </tr>
                  ) : (
                    applydata.map((item) => {
                      const status = item?.status || "PENDING";

                      const statusColor =
                        status === "APPROVED"
                          ? "success"
                          : status === "REJECTED"
                          ? "danger"
                          : "warning";

                      return (
                        <tr key={item._id}>
                          <td className="fw-semibold">
                            {item?.formType || "-"}
                          </td>

                          <td>
                            {item?.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : "-"}
                          </td>

                          <td style={{ maxWidth: 360 }}>
                            <div
                              className="text-truncate"
                              title={item?.reason || ""}
                            >
                              {item?.reason || "-"}
                            </div>
                          </td>

                          <td>
                            <span
                              className={`badge text-bg-${statusColor} rounded-pill`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="text-end">
                            {item?.attachment ? (
                              <a
                                className="btn btn-outline-primary btn-sm rounded-3"
                                href={item.attachment}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <i className="bi bi-eye me-1"></i>
                                View
                              </a>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="small text-muted mt-2">
              <i className="bi bi-lightbulb me-2"></i>
              Tip: If attachment is uploaded, you can open it from “View”.
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default ApplyForm;