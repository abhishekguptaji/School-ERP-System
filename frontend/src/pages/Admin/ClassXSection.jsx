import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./css/ClassXSection.css";

import {
  createSubjectByAdmin,
  deleteSubjectByAdmin,
  getAllClassesWithSubjectsByAdmin,
  getAllSubjectsByAdmin,
  allocateSubjectsToClassByAdmin,
} from "../../services/adminService.js";

function ClassXSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  // subject form (ONLY NAME)
  const [newSubjectName, setNewSubjectName] = useState("");
  const [creatingSubject, setCreatingSubject] = useState(false);

  const selectedClassObj = useMemo(() => {
    return classes.find((c) => c._id === selectedClassId);
  }, [classes, selectedClassId]);

  // ==============================
  // FETCH FUNCTIONS (IMPORTANT FIX)
  // ==============================

  const fetchSubjects = async () => {
    const subRes = await getAllSubjectsByAdmin();
    setSubjects(subRes?.data || []);
  };

  const fetchClasses = async (firstTime = false) => {
    const classRes = await getAllClassesWithSubjectsByAdmin();
    const classList = classRes?.data || [];

    setClasses(classList);

    // auto select first class only on first load
    if (firstTime && classList.length > 0) {
      setSelectedClassId(classList[0]._id);
      setSelectedSubjectIds([]); // start empty
    }
  };

  // ==============================
  // INITIAL LOAD
  // ==============================
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchSubjects(), fetchClasses(true)]);
      } catch (err) {
        Swal.fire(
          "Error",
          err?.response?.data?.message || "Failed to load",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line
  }, []);

  // ==============================
  // CLASS CHANGE
  // ==============================
  const handleChangeClass = (classId) => {
    setSelectedClassId(classId);

    const cls = classes.find((c) => c._id === classId);
    const ids = (cls?.subjects || []).map((s) => s._id);

    setSelectedSubjectIds(ids);
  };

  // ==============================
  // SUBJECT TOGGLE
  // ==============================
  const toggleSubject = (id) => {
    setSelectedSubjectIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  // ==============================
  // SAVE ALLOCATION
  // ==============================
  const handleSave = async () => {
    if (!selectedClassId) {
      return Swal.fire("Warning", "Please select a class first", "warning");
    }

    try {
      setSaving(true);

      const res = await allocateSubjectsToClassByAdmin(selectedClassId, {
        subjectIds: selectedSubjectIds,
      });

      Swal.fire("Saved", res.message || "Saved successfully", "success");

      // refresh BOTH after saving
      await Promise.all([fetchSubjects(), fetchClasses(false)]);

      // clear selection after save
      setSelectedSubjectIds([]);
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Save failed",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // CREATE SUBJECT (AUTO SELECT)
  // ==============================
  const handleCreateSubject = async (e) => {
    e.preventDefault();

    if (!newSubjectName.trim()) {
      return Swal.fire("Warning", "Subject name is required", "warning");
    }

    // Optional local check
    const already = subjects.some(
      (s) => s.name.toLowerCase() === newSubjectName.trim().toLowerCase()
    );

    if (already) {
      return Swal.fire("Warning", "Subject already exists", "warning");
    }

    try {
      setCreatingSubject(true);

      const res = await createSubjectByAdmin({
        name: newSubjectName.trim(), // example: "Maths (MTH)"
      });

      const createdSubject = res.data;

      Swal.fire("Created", res.message || "Created", "success");
      setNewSubjectName("");

      // ✅ refresh ONLY subjects list
      await fetchSubjects();

      // ✅ keep previous selection + select new one
      if (createdSubject?._id) {
        setSelectedSubjectIds((prev) => {
          if (prev.includes(createdSubject._id)) return prev;
          return [...prev, createdSubject._id];
        });
      }
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Failed", "error");
    } finally {
      setCreatingSubject(false);
    }
  };

  // ==============================
  // DELETE SUBJECT
  // ==============================
  const handleDeleteSubject = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Subject?",
      text: "This subject will be removed from all classes also.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteSubjectByAdmin(id);
      Swal.fire("Deleted", res.message || "Deleted", "success");

      // refresh both
      await Promise.all([fetchSubjects(), fetchClasses(false)]);

      // remove from selection
      setSelectedSubjectIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Failed", "error");
    }
  };

  // ==============================
  // UI
  // ==============================
  if (loading) {
    return (
      <div className="container-fluid p-3">
        <h4 className="adminPageTitle mb-0">Class Subject Allocation</h4>
        <div className="adminCard p-4 mt-3">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3 adminAllocateWrap">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 className="adminPageTitle mb-0">Class Subject Allocation</h4>
          <p className="text-muted mb-0">
            Create subjects like: <b>Maths (MTH)</b> and allocate class-wise
          </p>
        </div>
      </div>

      <div className="row g-3 mt-2">
        {/* LEFT */}
        <div className="col-lg-4">
          <div className="adminCard p-3">
            <div className="adminCardTitle">Select Class</div>

            <select
              className="form-select mt-2"
              value={selectedClassId}
              onChange={(e) => handleChangeClass(e.target.value)}
            >
              <option value="">-- Select Class --</option>

              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  Class {c.className}
                </option>
              ))}
            </select>

            <div className="mt-3 small text-muted">
              <b>Selected:</b> {selectedSubjectIds.length} subjects
            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Allocation"}
            </button>

            <button
              className="btn btn-outline-secondary w-100 mt-2"
              onClick={() => setSelectedSubjectIds([])}
            >
              Clear Selection
            </button>
          </div>

          {/* SUBJECT MASTER */}
          <div className="adminCard p-3 mt-3">
            <div className="adminCardTitle">Subject Master</div>

            <form onSubmit={handleCreateSubject} className="mt-2">
              <input
                className="form-control mb-2"
                placeholder="Example: Maths (MTH)"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />

              <button
                className="btn btn-dark w-100"
                disabled={creatingSubject}
              >
                {creatingSubject ? "Creating..." : "Add Subject"}
              </button>
            </form>

            <div className="text-muted small mt-2">
              Tip: Write subject like <b>SubjectName (Code)</b>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-8">
          <div className="adminCard p-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <div className="adminCardTitle mb-0">Subjects</div>
                <div className="text-muted small">
                  Tick subjects for{" "}
                  <b>Class {selectedClassObj?.className || "-"}</b>
                </div>
              </div>

              <div className="small text-muted">
                Total: <b>{subjects.length}</b>
              </div>
            </div>

            <div className="row mt-3 g-2">
              {subjects.map((s) => {
                const active = selectedSubjectIds.includes(s._id);

                return (
                  <div key={s._id} className="col-md-6 col-xl-4">
                    <div
                      className={`subjectTile ${active ? "active" : ""}`}
                      onClick={() => toggleSubject(s._id)}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <div className="subjectName">{s.name}</div>
                        </div>

                        <div className="d-flex flex-column gap-2 align-items-end">
                          <span
                            className={`badge ${
                              active ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            {active ? "Selected" : "Not Selected"}
                          </span>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubject(s._id);
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {subjects.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-warning mb-0">
                    No subjects found. Add subjects first.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="adminCard p-3 mt-3">
            <div className="adminCardTitle">Preview Allocation</div>

            <div className="mt-2 d-flex flex-wrap gap-2">
              {selectedSubjectIds.map((id) => {
                const sub = subjects.find((s) => s._id === id);
                if (!sub) return null;

                return (
                  <span key={id} className="badge bg-primary px-3 py-2">
                    {sub.name}
                  </span>
                );
              })}

              {selectedSubjectIds.length === 0 && (
                <div className="text-muted">
                  No subjects selected for allocation.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassXSection;