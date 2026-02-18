import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import {
  adminCollectFee,
  adminGetAllInvoices,
  adminGetInvoicePayments,
} from "../../services/adminService.js";

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

function FeeCollection() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterQuarter, setFilterQuarter] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Collect Modal
  const [showCollect, setShowCollect] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState("Cash");
  const [note, setNote] = useState("");

  // Payments Modal
  const [showPayments, setShowPayments] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  // ==========================
  // FETCH INVOICES
  // ==========================
  const fetchInvoices = async (showLoader = true) => {
    try {
      if (showLoader) {
        Swal.fire({
          title: "Loading invoices...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
      }

      setLoading(true);

      const res = await adminGetAllInvoices();
      console.log(res.data);
      // if (!res.data?.success) {
      //   throw new Error(res.data?.message || "Failed to load invoices");
      // }

      const list = res.data?.data?.invoices || [];
      setInvoices(list);

      if (showLoader) {
        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Invoices Loaded",
          text: `Total: ${res.data?.data?.total || list.length}`,
          timer: 1200,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.log(err);
      if (showLoader) Swal.close();

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load invoices",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(true);
  }, []);

  // ==========================
  // FILTERED LIST (Updated)
  // ==========================
  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const invoiceNo = inv?.invoiceNo || "";
      const admission = inv?.student?.admissionNumber || "";
      const className = inv?.student?.className || inv?.className || "";

      const matchSearch =
        invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
        String(admission).toLowerCase().includes(search.toLowerCase()) ||
        String(className).toLowerCase().includes(search.toLowerCase());

      const matchQuarter =
        filterQuarter === "ALL" ? true : inv.quarter === filterQuarter;

      const matchStatus =
        filterStatus === "ALL" ? true : inv.status === filterStatus;

      return matchSearch && matchQuarter && matchStatus;
    });
  }, [invoices, search, filterQuarter, filterStatus]);

  // ==========================
  // OPEN COLLECT MODAL
  // ==========================
  const openCollectModal = (inv) => {
    setSelectedInvoice(inv);
    setPayAmount("");
    setPayMode("Cash");
    setNote("");
    setShowCollect(true);
  };

  // ==========================
  // COLLECT FEE
  // ==========================
  const collectFee = async () => {
    try {
      if (!selectedInvoice) return;

      const amt = Number(payAmount);

      if (!amt || amt <= 0) {
        return Swal.fire({
          icon: "warning",
          title: "Invalid Amount",
          text: "Enter a valid amount",
        });
      }

      if (amt > selectedInvoice.dueAmount) {
        return Swal.fire({
          icon: "warning",
          title: "Invalid Amount",
          text: "Amount cannot be more than Due Amount",
        });
      }

      Swal.fire({
        title: "Collecting payment...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await adminCollectFee(selectedInvoice._id, {
        paidAmount: amt,
        mode: payMode,
        note,
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Payment failed");
      }

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        html: `
          <div style="text-align:left">
            <b>Receipt:</b> ${res.data?.data?.payment?.receiptNo || "-"} <br/>
            <b>Paid:</b> ${formatMoney(res.data?.data?.payment?.paidAmount || amt)} <br/>
            <b>Status:</b> ${res.data?.data?.invoice?.status || "UPDATED"}
          </div>
        `,
        confirmButtonText: "OK",
      });

      setShowCollect(false);
      fetchInvoices(false);
    } catch (err) {
      console.log(err);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong",
      });
    }
  };

  // ==========================
  // OPEN PAYMENTS MODAL (Updated)
  // ==========================
  const openPaymentsModal = async (inv) => {
    try {
      setSelectedInvoice(inv);
      setShowPayments(true);
      setPayments([]);
      setPaymentsLoading(true);

      const res = await adminGetInvoicePayments(inv._id);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to load payments");
      }

      setPayments(res.data?.data || []);
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load payments",
      });
    } finally {
      setPaymentsLoading(false);
    }
  };

  return (
    <div className="container-fluid p-3">
      <div className="mb-3">
        <h3 className="fw-bold mb-0">Fee Collection</h3>
        <p className="text-muted mb-0">
          Search invoices, collect quarterly fee, view receipts
        </p>
      </div>

      {/* Filters */}
      <div className="card shadow-sm border-0 rounded-4 mb-3">
        <div className="card-body d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <div className="d-flex gap-2 flex-wrap">
            <input
              className="form-control"
              style={{ width: 280 }}
              placeholder="Search invoice / admission / class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="form-select"
              style={{ width: 160 }}
              value={filterQuarter}
              onChange={(e) => setFilterQuarter(e.target.value)}
            >
              <option value="ALL">All Quarters</option>
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </select>

            <select
              className="form-select"
              style={{ width: 160 }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="DUE">DUE</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="PAID">PAID</option>
              <option value="OVERDUE">OVERDUE</option>
            </select>
          </div>

          <button
            className="btn btn-outline-dark"
            onClick={() => fetchInvoices(true)}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Invoices</h5>

          {loading ? (
            <div className="text-muted">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Invoice</th>
                    <th>Student</th>
                    <th>Quarter</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center text-muted py-4">
                        No invoices found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((inv) => (
                      <tr key={inv._id}>
                        <td className="fw-semibold">{inv.invoiceNo}</td>

                        {/* ✅ Updated student display */}
                        <td>
                          <div className="fw-semibold">
                            Admission No:{" "}
                            {inv?.student?.admissionNumber || "N/A"}
                          </div>
                          <div className="text-muted small">
                            Class: {inv?.student?.className || inv?.className}
                          </div>
                        </td>

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

                        <td className="text-end d-flex gap-2 justify-content-end">
                          <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={() => openPaymentsModal(inv)}
                          >
                            <i className="bi bi-receipt me-1"></i>
                            Payments
                          </button>

                          <button
                            className="btn btn-primary btn-sm"
                            disabled={inv.dueAmount === 0}
                            onClick={() => openCollectModal(inv)}
                          >
                            <i className="bi bi-cash-coin me-1"></i>
                            Collect
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Collect Modal */}
      {showCollect && selectedInvoice && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Collect Fee</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowCollect(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-2">
                  <div className="fw-semibold">
                    Admission No:{" "}
                    {selectedInvoice?.student?.admissionNumber || "N/A"}
                  </div>
                  <div className="text-muted small">
                    {selectedInvoice.invoiceNo} | {selectedInvoice.quarter} | Due:{" "}
                    {formatMoney(selectedInvoice.dueAmount)}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Pay Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Mode</label>
                  <select
                    className="form-select"
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="NetBanking">NetBanking</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold">Note</label>
                  <input
                    className="form-control"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Optional note"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setShowCollect(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={collectFee}>
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payments Modal */}
      {showPayments && selectedInvoice && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Payments - {selectedInvoice.invoiceNo}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowPayments(false)}
                ></button>
              </div>

              <div className="modal-body">
                {paymentsLoading ? (
                  <div className="text-muted">Loading payments...</div>
                ) : payments.length === 0 ? (
                  <div className="text-muted">No payments found.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Receipt</th>
                          <th>Amount</th>
                          <th>Mode</th>
                          <th>Collected By</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p._id}>
                            <td className="fw-semibold">{p.receiptNo}</td>
                            <td className="fw-semibold text-success">
                              {formatMoney(p.paidAmount)}
                            </td>
                            <td>{p.mode}</td>

                            {/* ✅ Updated */}
                            <td>{p?.collectedBy?.email || "Admin"}</td>

                            <td>
                              {p.paidAt
                                ? new Date(p.paidAt).toLocaleString()
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setShowPayments(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeeCollection;