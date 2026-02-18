import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  adminGetFeeStructures,
  adminSaveFeeStructure,
} from "../../services/adminService.js";

function FeeStructure() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(false);

  const [className, setClassName] = useState("1");
  const [academicYear, setAcademicYear] = useState("2025-26");

  const defaultItems = [
    { name: "Tuition Fee", amount: 0, type: "MONTHLY" },
    { name: "Transport Fee", amount: 0, type: "MONTHLY" },
    { name: "Exam Fee", amount: 0, type: "QUARTERLY" },
    { name: "Annual Charges", amount: 0, type: "YEARLY" },
  ];

  const [items, setItems] = useState(defaultItems);

  const fetchStructures = async () => {
    try {
      setLoading(true);
      const res = await adminGetFeeStructures();
      setStructures(res?.data || res || []);
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to load fee structures",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStructures();
  }, []);

  const addItem = () => {
    setItems((prev) => [...prev, { name: "", amount: 0, type: "MONTHLY" }]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, key, value) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [key]: value } : it))
    );
  };

  //  Reset amounts to 0 after save
  const resetAmountsToZero = () => {
    setItems((prev) =>
      prev.map((x) => ({
        ...x,
        amount: 0,
      }))
    );
  };

  const saveStructure = async () => {
    try {
      if (!className || !academicYear) {
        return Swal.fire({
          icon: "warning",
          title: "Required",
          text: "Class and Academic Year required",
        });
      }

      const cleaned = items
        .filter((x) => x.name && Number(x.amount) >= 0)
        .map((x) => ({
          name: x.name.trim(),
          amount: Number(x.amount),
          type: x.type,
        }));

      if (cleaned.length === 0) {
        return Swal.fire({
          icon: "warning",
          title: "No Items",
          text: "Please add at least one fee item",
        });
      }

      setLoading(true);

      await adminSaveFeeStructure({
        className,
        academicYear,
        items: cleaned,
      });

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Fee Structure Saved Successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      //  refresh list
      await fetchStructures();

      //  set amounts 0 after save
      resetAmountsToZero();
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.response?.data?.message || "Failed to save structure",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStructureToForm = (s) => {
    setClassName(s.className);
    setAcademicYear(s.academicYear);

    // when loading structure -> also ensure amount exists
    setItems(
      (s.items || []).map((x) => ({
        name: x.name,
        amount: x.amount ?? 0,
        type: x.type || "MONTHLY",
      }))
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-fluid  px-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="fw-bold mb-0">Fee Structure</h3>
          <p className="text-muted mb-0">
            Setup class-wise fees according to requirement.
          </p>
        </div>
      </div>

      {/* Create / Update */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body">
          <div className="row g-3 mb-3">
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

            <div className="col-md-6 d-flex align-items-end justify-content-end gap-2">
              <button className="btn btn-outline-dark" onClick={addItem}>
                <i className="bi bi-plus-circle me-2"></i>Add Fee Item
              </button>

              <button
                className="btn btn-primary"
                onClick={saveStructure}
                disabled={loading}
              >
                <i className="bi bi-save me-2"></i>
                {loading ? "Saving..." : "Save Structure"}
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Fee Name</th>
                  <th style={{ width: 150 }}>Amount</th>
                  <th style={{ width: 170 }}>Type</th>
                  <th className="text-end" style={{ width: 120 }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        className="form-control"
                        value={it.name}
                        onChange={(e) =>
                          updateItem(idx, "name", e.target.value)
                        }
                        placeholder="Fee Name"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={it.amount}
                        onChange={(e) =>
                          updateItem(idx, "amount", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={it.type}
                        onChange={(e) =>
                          updateItem(idx, "type", e.target.value)
                        }
                      >
                        <option value="MONTHLY">MONTHLY</option>
                        <option value="QUARTERLY">QUARTERLY</option>
                        <option value="YEARLY">YEARLY</option>
                        <option value="ONE_TIME">ONE_TIME</option>
                      </select>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeItem(idx)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No items. Add fee items.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Existing Structures */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Saved Fee Structures</h5>

          {structures.length === 0 ? (
            <div className="text-muted">No fee structures found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Class</th>
                    <th>Academic Year</th>
                    <th>Items</th>
                    <th>Created</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {structures.map((s) => (
                    <tr key={s._id}>
                      <td className="fw-semibold">Class {s.className}</td>
                      <td>{s.academicYear}</td>
                      <td>{s.items?.length || 0}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={() => loadStructureToForm(s)}
                        >
                          <i className="bi bi-pencil-square me-1"></i>Edit
                        </button>
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

export default FeeStructure;