import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { studentGetMyInvoices } from "../../services/authService.js";

function formatMoney(amount) {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}

function statusBadge(status) {
  if (status === "PAID") return <span className="badge bg-success">PAID</span>;
  if (status === "PARTIAL")
    return <span className="badge bg-warning text-dark">PARTIAL</span>;
  if (status === "OVERDUE")
    return <span className="badge bg-danger">OVERDUE</span>;
  return <span className="badge bg-secondary">DUE</span>;
}

function StuFee() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

const fetchMyInvoices = async (showLoader = true) => {
  try {
    if (showLoader) {
      Swal.fire({
        title: "Loading invoices...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
    }

    setLoading(true);

    const res = await studentGetMyInvoices();

    if (!res?.success) {
      throw new Error(res?.message || "Failed to load invoices");
    }

    setInvoices(res?.data || []);

    if (showLoader) {
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Invoices Loaded",
        text: `Total: ${res?.data?.length || 0}`,
        timer: 1200,
        showConfirmButton: false,
      });
    }
  } catch (err) {
    console.log(err);
    Swal.close();

    Swal.fire({
      icon: "error",
      title: "Failed",
      text: err?.response?.data?.message || err?.message || "Server error",
    });
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchMyInvoices(true);
  }, []);

  const summary = useMemo(() => {
    const total = invoices.reduce((s, x) => s + (x.totalAmount || 0), 0);
    const paid = invoices.reduce((s, x) => s + (x.paidAmount || 0), 0);
    const due = invoices.reduce((s, x) => s + (x.dueAmount || 0), 0);
    return { total, paid, due };
  }, [invoices]);

  return (
    <div className="container-fluid px-5">
      <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">My Fees</h3>
          <p className="text-muted mb-0">View your quarterly fee invoices</p>
        </div>

        <button
          className="btn btn-outline-dark"
          onClick={() => fetchMyInvoices(true)}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <div className="text-muted">Total Fee</div>
              <div className="fw-bold fs-4">{formatMoney(summary.total)}</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <div className="text-muted">Paid</div>
              <div className="fw-bold fs-4 text-success">
                {formatMoney(summary.paid)}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <div className="text-muted">Due</div>
              <div className="fw-bold fs-4 text-danger">
                {formatMoney(summary.due)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">My Invoices</h5>

          {loading ? (
            <div className="text-muted">Loading...</div>
          ) : invoices.length === 0 ? (
            <div className="text-muted">No invoices found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Invoice</th>
                    <th>Quarter</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv._id}>
                      <td className="fw-semibold">{inv.invoiceNo}</td>
                      <td>{inv.quarter}</td>
                      <td>{formatMoney(inv.totalAmount)}</td>
                      <td className="text-success fw-semibold">
                        {formatMoney(inv.paidAmount)}
                      </td>
                      <td className="text-danger fw-semibold">
                        {formatMoney(inv.dueAmount)}
                      </td>
                      <td>{statusBadge(inv.status)}</td>
                      <td>
                        {inv.dueDate
                          ? new Date(inv.dueDate).toLocaleDateString()
                          : "-"}
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
  );
}

export default StuFee;