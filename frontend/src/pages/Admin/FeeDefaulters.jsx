import { useEffect, useState } from "react";
import { adminGetDefaulters } from "../../services/adminService.js";
import Swal from "sweetalert2";
function formatMoney(amount) {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}
 function FeeDefaulters() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

const fetchDefaulters = async (showLoader = true) => {
  try {
    if (showLoader) {
      Swal.fire({
        title: "Loading defaulters...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
    }

    const res = await adminGetDefaulters(); // returns res.data already
    console.log(res);

    if (!res?.success) {
      throw new Error(res?.message || "Failed to load defaulters");
    }

    const list = res?.data?.defaulters || [];
    setData(list);

    if (showLoader) {
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Defaulters Loaded",
        text: `Total: ${res?.data?.total || list.length}`,
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
      text:
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load defaulters",
    });
  }
};

  useEffect(() => {
    fetchDefaulters();
  }, []);

  return (
    <div className="container-fluid px-5">
      <div className="mb-3">
        <h3 className="fw-bold mb-0">Fee Defaulters</h3>
        <p className="text-muted mb-0">
          Students whose due date is crossed and fee is pending.
        </p>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          {loading ? (
            <div className="text-muted">Loading...</div>
          ) : data.length === 0 ? (
            <div className="text-muted">No defaulters found </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Student</th>
                    <th>Invoice</th>
                    <th>Quarter</th>
                    <th>Total</th>
                    <th>Due</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((inv) => (
                    <tr key={inv._id}>
                      <td>
                        <div className="fw-semibold">
                          {inv?.studentId?.studentName}
                        </div>
                        <div className="text-muted small">
                          Roll: {inv?.studentId?.rollNo} | Class:{" "}
                          {inv?.studentId?.className}-{inv?.studentId?.section}
                        </div>
                      </td>
                      <td className="fw-semibold">{inv.invoiceNo}</td>
                      <td>{inv.quarter}</td>
                      <td>{formatMoney(inv.totalAmount)}</td>
                      <td className="fw-bold text-danger">
                        {formatMoney(inv.dueAmount)}
                      </td>
                      <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
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

export default FeeDefaulters; 