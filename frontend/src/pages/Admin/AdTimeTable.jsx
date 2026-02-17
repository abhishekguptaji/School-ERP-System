import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./css/Exams.css";

import {
  getAllClassesSubjectTimeTable,
  getSubjectsByClass,
  getAllocatedClass,
  getTimeTable,
  saveTimeTableCell,
  deleteTimeTableCell,
  clearTimeTable,
} from "../../services/adminService.js";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PERIODS = [
  { no: 1, time: "09:00 - 09:40" },
  { no: 2, time: "09:40 - 10:20" },
  { no: 3, time: "10:20 - 11:00" },
  { no: 4, time: "11:00 - 11:40" },
  { no: 5, time: "11:40 - 12:20" },
  { no: 6, time: "12:20 - 01:00" },
];

const makeCellKey = ({ day, periodNo }) => `${day}_${periodNo}`;

function AdTimeTable() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [allocations, setAllocations] = useState({});
  // subjectId => { teacherId, periodsPerWeek, teacherName, teacherEmail }

  const [timetable, setTimetable] = useState({});
  // key: day_periodNo => { day, periodNo, subjectId, teacherId, subjectName, teacherName }

  const [loading, setLoading] = useState(false);

  // editor
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeCell, setActiveCell] = useState(null);
  const [subjectId, setSubjectId] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const clsRes = await getAllClassesSubjectTimeTable();
        const cls = clsRes.data || [];
        setClasses(cls);

        if (cls.length > 0) setClassId(cls[0]._id);
      } catch (err) {
        Swal.fire("Error", "Failed to load classes", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!classId) return;

    const load = async () => {
      try {
        setLoading(true);

        // subjects
        const subRes = await getSubjectsByClass(classId);
        const subs = subRes.data || [];
        setSubjects(subs);

        // allocations
        const allocRes = await getAllocatedClass(classId);
        const allocList = allocRes.data || [];

        const allocMap = {};
        for (const row of allocList) {
          const sid = row.subjectId?._id;
          allocMap[sid] = {
            teacherId: row.teacherId?._id || "",
            teacherName: row.teacherId?.user?.name || "",
            teacherEmail: row.teacherId?.user?.email || "",
            periodsPerWeek: row.periodsPerWeek || 0,
          };
        }
        setAllocations(allocMap);

        // timetable
        const ttRes = await getTimeTable(classId);
        const list = ttRes.data || [];

        const ttMap = {};
        for (const row of list) {
          const key = makeCellKey({ day: row.day, periodNo: row.periodNo });
          ttMap[key] = {
            day: row.day,
            periodNo: row.periodNo,
            subjectId: row.subjectId?._id,
            subjectName: row.subjectId?.name || "N/A",
            teacherId: row.teacherId?._id,
            teacherName: row.teacherId?.user?.name || "N/A",
          };
        }
        setTimetable(ttMap);
      } catch (err) {
        setSubjects([]);
        setAllocations({});
        setTimetable({});
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [classId]);

  const className = classes.find((c) => c._id === classId)?.className || "N/A";

  const allocatedSubjects = useMemo(() => {
    return subjects.filter((s) => allocations[s._id]?.teacherId);
  }, [subjects, allocations]);

  const stats = useMemo(() => {
    return { filled: Object.keys(timetable).length };
  }, [timetable]);

  const openEditor = (day, periodNo) => {
    const key = makeCellKey({ day, periodNo });
    const existing = timetable[key];

    setActiveCell({ day, periodNo, key });

    if (existing?.subjectId) setSubjectId(existing.subjectId);
    else setSubjectId("");

    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setActiveCell(null);
    setSubjectId("");
  };

  const handleSave = async () => {
    if (!activeCell) return;

    if (!subjectId) {
      Swal.fire("Select subject", "Please select a subject.", "warning");
      return;
    }

    try {
      setLoading(true);

      const res = await saveTimeTableCell({
        classId,
        day: activeCell.day,
        periodNo: activeCell.periodNo,
        subjectId,
      });

      const row = res.data;

      const key = makeCellKey({ day: row.day, periodNo: row.periodNo });

      setTimetable((prev) => ({
        ...prev,
        [key]: {
          day: row.day,
          periodNo: row.periodNo,
          subjectId: row.subjectId?._id,
          subjectName: row.subjectId?.name || "N/A",
          teacherId: row.teacherId?._id,
          teacherName: row.teacherId?.user?.name || "N/A",
        },
      }));

      Swal.fire({
        icon: "success",
        title: "Saved!",
        timer: 900,
        showConfirmButton: false,
      });

      closeEditor();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to save",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!activeCell) return;

    const key = makeCellKey({
      day: activeCell.day,
      periodNo: activeCell.periodNo,
    });
    const existing = timetable[key];

    if (!existing) {
      closeEditor();
      return;
    }

    const confirm = await Swal.fire({
      icon: "question",
      title: "Delete this period?",
      text: "This will remove subject from this timetable cell.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      await deleteTimeTableCell(classId, activeCell.day, activeCell.periodNo);

      setTimetable((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 900,
        showConfirmButton: false,
      });

      closeEditor();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to delete",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearWholeTimetable = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Clear timetable?",
      text: `This will remove all periods for Class ${className}.`,
      showCancelButton: true,
      confirmButtonText: "Yes, clear",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      await clearTimeTable(classId);

      setTimetable({});

      Swal.fire({
        icon: "success",
        title: "Cleared!",
        timer: 900,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to clear",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderCell = (day, periodNo) => {
    const key = makeCellKey({ day, periodNo });
    const entry = timetable[key];

    if (!entry) {
      return (
        <button
          className="ttCell empty"
          onClick={() => openEditor(day, periodNo)}
        >
          <div className="ttEmptyText">
            <i className="bi bi-plus-circle"></i>
            <span>Add</span>
          </div>
        </button>
      );
    }

    return (
      <button
        className="ttCell filled"
        onClick={() => openEditor(day, periodNo)}
      >
        <div className="ttSub">{entry.subjectName}</div>
        <div className="ttTeacher">
          <i className="bi bi-person-badge"></i> {entry.teacherName}
        </div>
      </button>
    );
  };

  return (
    <div className="ttPage">
      {/* HEADER */}
      <div className="ttHeader">
        <div>
          <h3 className="mb-1 fw-bold text-primary">Time Table Creation</h3>
          <p className="mb-0 text-muted">
            Click any cell to assign subject. Teacher auto-fills from
            allocation.
          </p>
        </div>

        <div className="ttStats">
          <div className="ttStatCard">
            <div className="ttStatLabel">Selected</div>
            <div className="ttStatValue">Class {className}</div>
          </div>
          <div className="ttStatCard">
            <div className="ttStatLabel">Filled Periods</div>
            <div className="ttStatValue">{stats.filled}</div>
          </div>
          <div className="ttStatCard">
            <div className="ttStatLabel">Allocated Subjects</div>
            <div className="ttStatValue">{allocatedSubjects.length}</div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="ttFilters">
        <div className="ttFilterLeft">
          <div className="ttSelectBox">
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

          <div className="ttInfoBox">
            <i className="bi bi-shield-check"></i>
            <div>
              <div className="fw-bold">Clash Protection</div>
              <div className="text-muted">
                Prevents teacher same day+period in another class.
              </div>
            </div>
          </div>
        </div>

        <div className="ttFilterRight">
          <button
            className="btn btn-outline-danger"
            onClick={handleClearWholeTimetable}
            disabled={loading}
          >
            <i className="bi bi-trash3 me-1"></i> Clear Timetable
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="ttTableWrap">
        <table className="table table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: 110 }}>Period</th>
              <th style={{ width: 160 }}>Time</th>
              {DAYS.map((d) => (
                <th key={d} className="text-center">
                  {d}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {PERIODS.map((p) => (
              <tr key={p.no}>
                <td className="fw-bold text-center">#{p.no}</td>
                <td className="text-muted">{p.time}</td>
                {DAYS.map((day) => (
                  <td key={day} className="ttTd">
                    {renderCell(day, p.no)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LOADING OVERLAY */}
      {loading && (
        <div style={{ padding: 12 }} className="text-muted">
          Loading...
        </div>
      )}

      {/* EDITOR MODAL */}
      {editorOpen && activeCell && (
        <div className="ttModalOverlay" onClick={closeEditor}>
          <div className="ttModal" onClick={(e) => e.stopPropagation()}>
            <div className="ttModalHeader">
              <div>
                <h5 className="mb-0 fw-bold">Edit Period</h5>
                <div className="text-muted">
                  Class {className} • {activeCell.day} • Period{" "}
                  {activeCell.periodNo}
                </div>
              </div>

              <button className="ttCloseBtn" onClick={closeEditor}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="ttModalBody">
              <div className="ttField">
                <label>Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  <option value="">-- Select Subject --</option>
                  {allocatedSubjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <small className="text-muted">
                  Only subjects with teacher allocation are shown.
                </small>
              </div>

              <div className="ttField">
                <label>Teacher (Auto)</label>
                <input
                  value={
                    subjectId ? allocations[subjectId]?.teacherName || "" : ""
                  }
                  readOnly
                  placeholder="Auto from allocation..."
                />
              </div>

              <div className="ttHint">
                <i className="bi bi-lightbulb-fill"></i>
                <div>
                  <div className="fw-bold">Tip</div>
                  <div className="text-muted">
                    If you want to change teacher, go to{" "}
                    <b>Subject Teacher Allocation</b> module.
                  </div>
                </div>
              </div>
            </div>

            <div className="ttModalActions">
              <button className="btn btn-outline-danger" onClick={handleDelete}>
                <i className="bi bi-trash3 me-1"></i> Delete
              </button>

              <button className="btn btn-primary" onClick={handleSave}>
                <i className="bi bi-check2-circle me-1"></i> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdTimeTable;
