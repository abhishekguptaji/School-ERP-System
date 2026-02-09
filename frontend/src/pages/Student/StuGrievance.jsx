import "./css/StuGrievance.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getShortProfileStudent,
  createMyGrievance,
  getMyGrievance,
} from "../../services/authService.js";

function StuGrievance() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const [applyForm, setapplyForm] = useState([]); // grievances list
  const [fileKey, setFileKey] = useState(Date.now());
  const [formData, setFormData] = useState({
    formTitle: "",
    formCategory: "",
    formPriority: "medium",
    formDescription: "",
    formAttachement: null, // File
  });

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getShortProfileStudent();

      if (!res?.success) {
        setError(res?.message || "Failed to load student data");
        setLoading(false);
        return;
      }

      setStudent(res?.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ===================== FETCH MY GRIEVANCES =====================
  const fetchMyGrievances = async () => {
    try {
      const res = await getMyGrievance();
      if (res?.success) {
        setapplyForm(res?.data || []);
      }
    } catch (err) {
      console.log("FETCH GRIEVANCE ERROR:", err);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchMyGrievances();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      formAttachement: file,
    }));
  };

  // ===================== SUBMIT HANDLER =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validations
    if (!formData.formTitle.trim()) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }

    if (!formData.formCategory) {
      Swal.fire("Error", "Category is required", "error");
      return;
    }

    if (!formData.formDescription.trim()) {
      Swal.fire("Error", "Description is required", "error");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("title", formData.formTitle.trim());
      payload.append("category", formData.formCategory);
      payload.append("priority", formData.formPriority);
      payload.append("description", formData.formDescription.trim());

      // backend expects: attachment
      if (formData.formAttachement) {
        payload.append("attachment", formData.formAttachement);
      }

      const res = await createMyGrievance(payload);

      if (!res?.success) {
        Swal.fire(
          "Error",
          res?.message || "Failed to create grievance",
          "error",
        );
        return;
      }

      Swal.fire("Success", res?.message || "Grievance created", "success");

      // reset form
      setFormData({
        formTitle: "",
        formCategory: "",
        formPriority: "medium",
        formDescription: "",
        formAttachement: null,
      });
      setFileKey(Date.now());
      // refresh list
      await fetchMyGrievances();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Something went wrong",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dash-loading text-center">
        Loading student dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dash-error">
        <h3>Complete The Profile First</h3>
        <p>{error}</p>
        <button onClick={fetchStudent}>Retry</button>
      </div>
    );
  }

  const user = student?.user;
  const applydata = applyForm || [];
  return (
    <>
      <div className="container pt-3 pb-3">
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="erpProfileCard">
              <div className="row g-0 align-items-center">
                <div className="col-12 d-flex justify-content-center p-3">
                  <img
                    className="erpProfileImg"
                    src={student?.userImage || "/default-user.png"}
                    alt="student"
                  />
                </div>

                <div className="col-12 p-3">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <div className="erpInfoBox">
                        <p className="erpLabel">Name</p>
                        <p className="erpValue">{user?.name || "-"}</p>
                      </div>
                    </div>

                    <div className="col-12 mb-3">
                      <div className="erpInfoBox">
                        <p className="erpLabel">Email</p>
                        <p className="erpValue">{user?.email || "-"}</p>
                      </div>
                    </div>

                    <div className="col-12 mb-3">
                      <div className="erpInfoBox">
                        <p className="erpLabel">Campus ID</p>
                        <p className="erpValue">{user?.campusId || "-"}</p>
                      </div>
                    </div>

                    <div className="col-12">
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

          <div className="col-12 col-lg-8">
            <div className="erpProfileCard">
              <div className="p-3">
                <h4 className="mb-1 text-center">Create Grievance</h4>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control"
                      name="formTitle"
                      value={formData.formTitle}
                      onChange={handleChange}
                      placeholder="Enter Title of Complain"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      name="formCategory"
                      value={formData.formCategory}
                      onChange={handleChange}
                    >
                      <option value="">Select Your Category</option>
                      <option value="transport">Transport</option>
                      <option value="fees">Fees</option>
                      <option value="exam">Exam</option>
                      <option value="facility">Facility</option>
                      <option value="technical">Technical</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      name="formPriority"
                      value={formData.formPriority}
                      onChange={handleChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      name="formDescription"
                      value={formData.formDescription}
                      onChange={handleChange}
                      placeholder="Write your grievance..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Attachment</label>
                    <input
                      className="form-control"
                      type="file"
                      key={fileKey}
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Grievance"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="erpProfileCard">
              <div className="p-3">
                <h4 className="mb-0 fw-bold text-center">My Grievances</h4>

                <hr className="my-3" />

                {/* EMPTY STATE */}
                {applydata?.length === 0 ? (
                  <div className="alert alert-info text-center mb-0">
                    No grievances found. Submit your first complaint.
                  </div>
                ) : (
                  <div className="erpProfileCard grievanceCard">
                    <table className="table table-hover align-middle mb-0 grievanceTable">
                      <thead className="grievanceTableHead">
                        <tr>
                          <th style={{ whiteSpace: "nowrap" }}>Ticket</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th style={{ whiteSpace: "nowrap" }}>Created</th>
                          <th>Attachment</th>
                        </tr>
                      </thead>

                      <tbody>
                        {applydata.map((g) => (
                          <tr key={g._id}>
                            {/* Ticket */}
                            <td style={{ whiteSpace: "nowrap" }}>
                              <span className="badge bg-light text-primary border">
                                {g.ticketId || "-"}
                              </span>
                            </td>

                            {/* Title + Description */}
                            <td style={{ minWidth: "260px" }}>
                              <div className="fw-semibold">{g.title}</div>
                              <div
                                className="text-muted"
                                style={{ fontSize: "12px" }}
                              >
                                {g.description?.slice(0, 70)}
                                {g.description?.length > 70 ? "..." : ""}
                              </div>
                            </td>

                            {/* Category */}
                            <td className="text-capitalize">
                              <span className="badge bg-primary-subtle text-primary border">
                                {g.category}
                              </span>
                            </td>

                            {/* Priority */}
                            <td className="text-capitalize">
                              <span
                                className={`badge ${
                                  g.priority === "high"
                                    ? "bg-danger"
                                    : g.priority === "medium"
                                      ? "bg-warning text-dark"
                                      : "bg-success"
                                }`}
                              >
                                {g.priority}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="text-capitalize">
                              <span
                                className={`badge ${
                                  g.status === "pending"
                                    ? "bg-secondary"
                                    : g.status === "in_progress"
                                      ? "bg-primary"
                                      : g.status === "resolved"
                                        ? "bg-success"
                                        : g.status === "rejected"
                                          ? "bg-danger"
                                          : "bg-dark"
                                }`}
                              >
                                {g.status}
                              </span>
                            </td>

                            {/* Created */}
                            <td style={{ whiteSpace: "nowrap" }}>
                              <span
                                className="text-muted"
                                style={{ fontSize: "13px" }}
                              >
                                {g.createdAt
                                  ? new Date(g.createdAt).toLocaleString()
                                  : "-"}
                              </span>
                            </td>

                            {/* Attachment */}
                            <td>
                              {g.attachment?.fileUrl ? (
                                <a
                                  href={g.attachment.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-primary"
                                >
                                  View
                                </a>
                              ) : (
                                <span className="text-muted">No File</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StuGrievance;
