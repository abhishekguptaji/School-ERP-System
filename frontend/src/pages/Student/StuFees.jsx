import { useMemo, useState } from "react";

function StuFee() {
  // Demo Student Info
  const studentInfo = {
    name: "Abhishek",
    rollNo: "100",
    className: "B.Tech (Sem 5)",
    section: "A",
  };

  // Demo Fee Data (API se replace)
  const feeData = {
    totalFee: 45000,
    paidFee: 30000,
    dueFee: 15000,

    installments: [
      {
        id: 1,
        title: "Installment 1",
        amount: 15000,
        dueDate: "2026-01-10",
        status: "Paid",
      },
      {
        id: 2,
        title: "Installment 2",
        amount: 15000,
        dueDate: "2026-02-10",
        status: "Paid",
      },
      {
        id: 3,
        title: "Installment 3",
        amount: 15000,
        dueDate: "2026-03-10",
        status: "Pending",
      },
    ],

    payments: [
      {
        id: 1,
        receiptNo: "REC-0012",
        date: "2026-01-10",
        amount: 15000,
        method: "UPI",
        status: "Success",
      },
      {
        id: 2,
        receiptNo: "REC-0019",
        date: "2026-02-10",
        amount: 15000,
        method: "Cash",
        status: "Success",
      },
    ],
  };

  const [selectedInstallment, setSelectedInstallment] = useState(null);

  const progressPercent = useMemo(() => {
    if (!feeData.totalFee) return 0;
    return Math.round((feeData.paidFee / feeData.totalFee) * 100);
  }, [feeData]);

  const installmentBadge = (status) => {
    if (status === "Paid") return "success";
    if (status === "Overdue") return "danger";
    return "warning"; // Pending
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              <i className="bi bi-cash-coin text-primary me-2"></i>
              Fee Details
            </h3>
            <div className="text-muted">
              View fee summary, installments and payment history
            </div>
          </div>

          {/* Student Mini Card */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body py-3 px-4">
              <div className="fw-bold">{studentInfo.name}</div>
              <div className="text-muted small">
                Roll No: <b>{studentInfo.rollNo}</b>
              </div>
              <div className="text-muted small">
                {studentInfo.className} ({studentInfo.section})
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted small">Total Fee</div>
                    <div className="fw-bold fs-4">₹{feeData.totalFee}</div>
                  </div>
                  <div
                    className="bg-light border rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: 52, height: 52 }}
                  >
                    <i className="bi bi-wallet2 fs-4 text-primary"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted small">Paid</div>
                    <div className="fw-bold fs-4 text-success">
                      ₹{feeData.paidFee}
                    </div>
                  </div>
                  <div
                    className="bg-light border rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: 52, height: 52 }}
                  >
                    <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted small">Due</div>
                    <div className="fw-bold fs-4 text-danger">
                      ₹{feeData.dueFee}
                    </div>
                  </div>
                  <div
                    className="bg-light border rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: 52, height: 52 }}
                  >
                    <i className="bi bi-exclamation-circle-fill fs-4 text-danger"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-1">
                  <i className="bi bi-graph-up-arrow text-primary me-2"></i>
                  Payment Progress
                </h5>
                <div className="text-muted small">
                  You have paid <b>{progressPercent}%</b> of total fee.
                </div>
              </div>

              <span className="badge text-bg-light border text-dark rounded-pill px-3 py-2">
                Paid: ₹{feeData.paidFee} / ₹{feeData.totalFee}
              </span>
            </div>

            <div className="progress mt-3" style={{ height: 12 }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* INSTALLMENTS */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-list-check text-primary me-2"></i>
                    Installments
                  </h5>

                  <span className="badge text-bg-light border text-dark rounded-pill">
                    {feeData.installments.length} Plans
                  </span>
                </div>

                <div className="d-flex flex-column gap-3">
                  {feeData.installments.map((ins) => (
                    <div
                      key={ins.id}
                      className="border rounded-4 p-3 bg-white"
                    >
                      <div className="d-flex align-items-start justify-content-between gap-3">
                        <div>
                          <div className="fw-bold">{ins.title}</div>
                          <div className="text-muted small mt-1">
                            <i className="bi bi-calendar-event me-2"></i>
                            Due: {ins.dueDate}
                          </div>
                          <div className="fw-semibold mt-2">
                            Amount: ₹{ins.amount}
                          </div>
                        </div>

                        <div className="text-end">
                          <span
                            className={`badge text-bg-${installmentBadge(
                              ins.status
                            )} rounded-pill`}
                          >
                            {ins.status}
                          </span>

                          {ins.status !== "Paid" && (
                            <button
                              className="btn btn-primary btn-sm rounded-3 mt-3"
                              onClick={() => setSelectedInstallment(ins)}
                            >
                              Pay Now <i className="bi bi-arrow-right ms-1"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="alert alert-light border rounded-4 small mt-3 mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Pay pending installments before due date to avoid late fine.
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT HISTORY */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-receipt-cutoff text-primary me-2"></i>
                    Payment History
                  </h5>

                  <button className="btn btn-outline-primary rounded-3">
                    <i className="bi bi-download me-2"></i>
                    Download All Receipts
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr className="text-muted">
                        <th>Receipt</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {feeData.payments.map((p) => (
                        <tr key={p.id}>
                          <td className="fw-semibold">{p.receiptNo}</td>
                          <td>{p.date}</td>
                          <td className="fw-bold">₹{p.amount}</td>
                          <td>{p.method}</td>
                          <td>
                            <span className="badge text-bg-success rounded-pill">
                              {p.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <button className="btn btn-outline-primary btn-sm rounded-3">
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {feeData.payments.length === 0 && (
                  <div className="alert alert-info rounded-4 border mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    No payments found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAY NOW MODAL */}
      {selectedInstallment && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Pay Installment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedInstallment(null)}
                ></button>
              </div>

              <div className="modal-body pt-2">
                <div className="p-3 bg-light rounded-4">
                  <div className="fw-bold">{selectedInstallment.title}</div>
                  <div className="text-muted small mt-1">
                    Due Date: <b>{selectedInstallment.dueDate}</b>
                  </div>
                  <div className="fw-semibold mt-2 fs-5">
                    Amount: ₹{selectedInstallment.amount}
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label fw-semibold">
                    Select Payment Method
                  </label>
                  <select className="form-select">
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Net Banking</option>
                    <option>Cash (Offline)</option>
                  </select>
                </div>

                <div className="alert alert-warning rounded-4 border small mt-3 mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Demo UI: Payment gateway integration will come here.
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary rounded-3"
                  onClick={() => setSelectedInstallment(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary rounded-3"
                  onClick={() => {
                    alert("Payment success (demo)");
                    setSelectedInstallment(null);
                  }}
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StuFee;
