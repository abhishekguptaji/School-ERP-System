import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./css/Attendence.css";

import {
  allocateSubjectTeacher,
  deleteClassSubjectAllocation,
  getAllocatedClass,
  getAllClassesSubjectTimeTable,
  getAllTeacherforTimeTable,
  getSubjectsByClass,
} from "../../services/adminService.js";

const PRIORITY_COLORS = [
  "bg-primary",
  "bg-success",
  "bg-warning text-dark",
  "bg-info text-dark",
  "bg-danger",
  "bg-secondary",
];

function badgeColor(index) {
  return PRIORITY_COLORS[index % PRIORITY_COLORS.length];
}

function SubjectTeacher() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [classId, setClassId] = useState("");

  // allocations map: subjectId => { teacherId, periodsPerWeek }
  const [allocations, setAllocations] = useState({});

  const [search, setSearch] = useState("");
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  const [loading, setLoading] = useState(false);

  // ===============================
  // Load classes + teachers (once)
  // ===============================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [clsRes, teacherRes] = await Promise.all([
          getAllClassesSubjectTimeTable(),
          getAllTeacherforTimeTable(),
        ]);

        const cls = clsRes.data || [];
        const t = teacherRes.data || [];

        setClasses(cls);
        setTeachers(t);

        if (cls.length > 0) setClassId(cls[0]._id);
      } catch (err) {
        Swal.fire("Error", "Failed to load classes/teachers", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ===============================
  // Load subjects + allocations
  // ===============================
  useEffect(() => {
    if (!classId) return;

    const load = async () => {
      try {
        setLoading(true);

        // Subjects
        const subRes = await getSubjectsByClass(classId);
        const subs = subRes.data || [];
        setSubjects(subs);
        console.log(subs);

        // Allocations
        const allocRes = await getAllocatedClass(classId);
        const list = allocRes.data || [];

        // Convert list -> map
        const map = {};
        for (const row of list) {
          map[row.subjectId?._id] = {
            teacherId: row.teacherId?._id || "",
            periodsPerWeek: row.periodsPerWeek || 0,
          };
        }

        setAllocations(map);
      } catch (err) {
        setSubjects([]);
        setAllocations({});
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [classId]);

  const selectedClassName =
    classes.find((c) => c._id === classId)?.className || "N/A";

  const filteredSubjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subjects;

    return subjects.filter((s) =>
      (s.subjectName || s.name || "").toLowerCase().includes(q)
    );
  }, [subjects, search]);

  const allocatedCount = useMemo(() => {
    return subjects.filter((s) => allocations[s._id]?.teacherId).length;
  }, [subjects, allocations]);

  // ===============================
  // Allocate / Update
  // ===============================
  const handleAllocate = async ({ subjectId, teacherId, periodsPerWeek }) => {
    if (!teacherId) {
      Swal.fire("Select teacher", "Please select teacher", "warning");
      return;
    }

    const periods = Number(periodsPerWeek);
    if (Number.isNaN(periods) || periods <= 0) {
      Swal.fire("Invalid", "Weekly periods must be > 0", "warning");
      return;
    }

    try {
      setLoading(true);

      await allocateSubjectTeacher({
        classId,
        subjectId,
        teacherId,
        periodsPerWeek: periods,
      });

      Swal.fire({
        icon: "success",
        title: "Saved!",
        timer: 900,
        showConfirmButton: false,
      });

      // Update local state
      setAllocations((prev) => ({
        ...prev,
        [subjectId]: { teacherId, periodsPerWeek: periods },
      }));
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to save",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Delete
  // ===============================
  const handleRemove = async ({ subjectId }) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "Remove allocation?",
      text: "Teacher + weekly periods will be removed.",
      showCancelButton: true,
      confirmButtonText: "Yes remove",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      await deleteClassSubjectAllocation(classId, subjectId);

      Swal.fire({
        icon: "success",
        title: "Removed!",
        timer: 800,
        showConfirmButton: false,
      });

      setAllocations((prev) => {
        const copy = { ...prev };
        delete copy[subjectId];
        return copy;
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to delete",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setExpandedSubjectId(null);
    setSearch("");
  }, [classId]);

  return (
    <div className="pageWrap">
      {/* HEADER */}
      <div className="erpHeader">
        <div>
          <h3 className="mb-1 fw-bold text-primary">
            Subject ↔ Teacher Allocation
          </h3>
          <p className="mb-0 text-muted">
            Allocate teachers and weekly periods for timetable creation.
          </p>
        </div>

        <div className="headerStats">
          <div className="statCard">
            <div className="statLabel">Selected</div>
            <div className="statValue">Class {selectedClassName}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Subjects</div>
            <div className="statValue">{subjects.length}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Allocated</div>
            <div className="statValue">{allocatedCount}</div>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="filterBar">
        <div className="filterLeft">
          <div className="selectBox">
            <label>Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              disabled={loading}
            >
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  Class {c.className}
                </option>
              ))}
            </select>
          </div>

          <div className="searchBox">
            <label>Search Subject</label>
            <div className="searchInput">
              <i className="bi bi-search"></i>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type subject name..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="gridWrap">
        {/* LEFT */}
        <div className="panel">
          <div className="panelHeader">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-journal-bookmark-fill me-2 text-primary"></i>
              Subjects
            </h5>
            <span className="pill">{filteredSubjects.length} subjects</span>
          </div>

          <div className="panelBody">
            {loading ? (
              <div className="emptyState">
                <div className="spinner-border text-primary"></div>
                <p className="mb-0 fw-semibold mt-2">Loading...</p>
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="emptyState">
                <i className="bi bi-emoji-frown"></i>
                <p className="mb-0 fw-semibold">No subjects found</p>
              </div>
            ) : (
              filteredSubjects.map((sub, idx) => {
                const subjectId = sub._id;
                const alloc = allocations[subjectId];

                const teacher = alloc?.teacherId
                  ? teachers.find((t) => t._id === alloc.teacherId)
                  : null;

                const isExpanded = expandedSubjectId === subjectId;

                return (
                  <div
                    key={subjectId}
                    className={`subjectCard ${isExpanded ? "active" : ""}`}
                    onClick={() =>
                      setExpandedSubjectId((prev) =>
                        prev === subjectId ? null : subjectId
                      )
                    }
                  >
                    <div className="subjectTop">
                      <div className="subjectName">
                        <span className={`dot ${badgeColor(idx)}`}></span>
                        <span className="fw-bold">
                          {sub.subjectName || sub.name}
                        </span>
                      </div>

                      {teacher ? (
                        <span className="statusBadge allocated">
                          <i className="bi bi-check-circle-fill me-1"></i>
                          Allocated
                        </span>
                      ) : (
                        <span className="statusBadge pending">
                          <i className="bi bi-clock-fill me-1"></i>
                          Pending
                        </span>
                      )}
                    </div>

                    <div className="subjectMeta">
                      <div className="metaRow">
                        <span className="metaLabel">Teacher:</span>
                        <span className="metaValue">
                          {teacher ? teacher.user?.name : "Not assigned"}
                        </span>
                      </div>

                      <div className="metaRow">
                        <span className="metaLabel">Department:</span>
                        <span className="metaValue">
                          {teacher ? teacher.department : "-"}
                        </span>
                      </div>

                      {/* <div className="metaRow">
                        <span className="metaLabel">Weekly Periods:</span>
                        <span className="metaValue">
                          {alloc?.periodsPerWeek ?? 0}
                        </span>
                      </div> */}
                    </div>

                    {isExpanded && (
                      <SubjectAllocateEditor
                        subject={sub}
                        teachers={teachers}
                        existing={alloc}
                        onAllocate={handleAllocate}
                        onRemove={handleRemove}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="panel">
          <div className="panelHeader">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-table me-2 text-primary"></i>
              Allocation Table
            </h5>
            <span className="pill">{allocatedCount} allocated</span>
          </div>

          <div className="panelBody">
            <div className="tableWrap">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "25%" }}>Subject</th>
                    <th style={{ width: "35%" }}>Teacher</th>
                    <th style={{ width: "20%" }}>Weekly Periods</th>
                    <th style={{ width: "20%" }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {subjects.map((sub) => {
                    const alloc = allocations[sub._id];
                    const teacher = alloc?.teacherId
                      ? teachers.find((t) => t._id === alloc.teacherId)
                      : null;

                    return (
                      <tr key={sub._id}>
                        <td className="fw-semibold">
                          {sub.subjectName || sub.name}
                        </td>

                        <td>
                          {teacher ? (
                            <div>
                              <div className="fw-semibold">
                                {teacher.user?.name}
                              </div>
                              <small className="text-muted">
                                {teacher.user?.email}
                              </small>
                            </div>
                          ) : (
                            <span className="text-muted">Not allocated</span>
                          )}
                        </td>

                        <td>
                          <span className="periodBadge">
                            {alloc?.periodsPerWeek ?? 0}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setExpandedSubjectId(sub._id)}
                            >
                              <i className="bi bi-pencil-square me-1"></i> Edit
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              disabled={!alloc?.teacherId}
                              onClick={() => handleRemove({ subjectId: sub._id })}
                            >
                              <i className="bi bi-trash3 me-1"></i> Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {subjects.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        No subjects found for this class.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="tipBox mt-3">
              <i className="bi bi-lightbulb-fill"></i>
              <div>
                <div className="fw-semibold">Tip</div>
                <div className="text-muted">
                  Allocate teacher + weekly periods for each subject.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footerNote">
        After this module, next step is{" "}
        <span className="fw-semibold text-primary">Time Table Creation</span>.
      </div>
    </div>
  );
}

function SubjectAllocateEditor({ subject, teachers, existing, onAllocate, onRemove }) {
  const [teacherId, setTeacherId] = useState(existing?.teacherId || "");
  const [periodsPerWeek, setPeriodsPerWeek] = useState(existing?.periodsPerWeek ?? 0);

  useEffect(() => {
    setTeacherId(existing?.teacherId || "");
    setPeriodsPerWeek(existing?.periodsPerWeek ?? 0);
  }, [existing?.teacherId, existing?.periodsPerWeek]);

  const teacher = teacherId ? teachers.find((t) => t._id === teacherId) : null;

  return (
    <div className="editorBox" onClick={(e) => e.stopPropagation()}>
      <div className="editorGrid">
        <div className="field">
          <label>Teacher</label>
          <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
            <option value="">-- Select Teacher --</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.user?.name} ({t.department})
              </option>
            ))}
          </select>

          {teacher && (
            <small className="text-muted">
              <i className="bi bi-envelope me-1"></i>
              {teacher.user?.email}
            </small>
          )}
        </div>

        <div className="field">
          <label>Weekly Periods</label>
          <input
            type="number"
            min="1"
            value={periodsPerWeek}
            onChange={(e) => setPeriodsPerWeek(e.target.value)}
            placeholder="0"
          />
          <small className="text-muted">Required for timetable planning</small>
        </div>
      </div>

      <div className="editorActions">
        <button
          className="btn btn-sm btn-primary"
          onClick={() =>
            onAllocate({
              subjectId: subject._id,
              teacherId,
              periodsPerWeek,
            })
          }
        >
          <i className="bi bi-check2-circle me-1"></i>
          Save
        </button>

        <button
          className="btn btn-sm btn-outline-danger"
          disabled={!existing?.teacherId}
          onClick={() => onRemove({ subjectId: subject._id })}
        >
          <i className="bi bi-trash3 me-1"></i>
          Remove
        </button>
      </div>
    </div>
  );
}

export default SubjectTeacher;