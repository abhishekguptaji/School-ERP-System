import { useState } from "react";
import { adminGenerateQuarterInvoices } from "../../services/adminService.js";
import Swal from "sweetalert2";

function GenerateQuarterInvoices() {
  const [className, setClassName] = useState("10");
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [quarter, setQuarter] = useState("Q1");
  const [dueDate, setDueDate] = useState("");
  const [includeYearlyInQ1, setIncludeYearlyInQ1] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generateInvoices = async () => {
    try {
      if (!dueDate) return alert("Please select Due Date");

      setLoading(true);
      const res = await adminGenerateQuarterInvoices({
        className,
        academicYear,
        quarter,
        dueDate,
        includeYearlyInQ1,
      });

      setResult(res.data.data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Invoices Generated!",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.response?.data?.message || "Failed to generate invoices",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-3">
      <div className="mb-3">
        <h3 className="fw-bold mb-0">Generate Quarterly Invoices</h3>
        <p className="text-muted mb-0">
          Generate Q1/Q2/Q3/Q4 invoices class-wise
        </p>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Class</label>
              <select
                className="form-select"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              >
                {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                ].map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Academic Year</label>
              <input
                className="form-control"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2025-26"
              />
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">Quarter</label>
              <select
                className="form-select"
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
              >
                <option value="Q1">Q1 (Apr-Jun)</option>
                <option value="Q2">Q2 (Jul-Sep)</option>
                <option value="Q3">Q3 (Oct-Dec)</option>
                <option value="Q4">Q4 (Jan-Mar)</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">Due Date</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-primary w-100"
                onClick={generateInvoices}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={includeYearlyInQ1}
              onChange={(e) => setIncludeYearlyInQ1(e.target.checked)}
              id="yearlyQ1"
            />
            <label className="form-check-label" htmlFor="yearlyQ1">
              Include YEARLY & ONE_TIME fee items in Q1
            </label>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Result</h5>

            <div className="row g-3">
              <div className="col-md-4">
                <div className="p-3 rounded-4 bg-light">
                  <div className="text-muted">Created Invoices</div>
                  <div className="fw-bold fs-3">{result.createdCount}</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 rounded-4 bg-light">
                  <div className="text-muted">Skipped (Already Exists)</div>
                  <div className="fw-bold fs-3">{result.skippedCount}</div>
                </div>
              </div>
            </div>

            <div className="text-muted mt-3 small">
              Tip: You can go to Fee Collection page to collect payments.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateQuarterInvoices;
