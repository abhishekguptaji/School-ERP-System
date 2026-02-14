import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./css/Exams.css";

/**
 * ---------------------------
 * DEMO MASTER DATA
 * ---------------------------
 */
const DEMO_CLASSES = [
  { _id: "c1", className: "Class 6" },
  { _id: "c2", className: "Class 7" },
  { _id: "c3", className: "Class 8" },
];

const DEMO_SECTIONS = [
  { _id: "s1", sectionName: "A" },
  { _id: "s2", sectionName: "B" },
];

const DEMO_TEACHERS = [
  { _id: "t1", name: "Rahul Sharma", email: "rahul@school.com" },
  { _id: "t2", name: "Neha Verma", email: "neha@school.com" },
  { _id: "t3", name: "Amit Singh", email: "amit@school.com" },
  { _id: "t4", name: "Pooja Gupta", email: "pooja@school.com" },
];

const DEMO_SUBJECTS_BY_CLASS = {
  c1: [
    { _id: "sub1", subjectName: "Maths" },
    { _id: "sub2", subjectName: "English" },
    { _id: "sub3", subjectName: "Science" },
    { _id: "sub4", subjectName: "SST" },
  ],
  c2: [
    { _id: "sub1", subjectName: "Maths" },
    { _id: "sub2", subjectName: "English" },
    { _id: "sub3", subjectName: "Science" },
    { _id: "sub5", subjectName: "Computer" },
  ],
  c3: [
    { _id: "sub1", subjectName: "Maths" },
    { _id: "sub2", subjectName: "English" },
    { _id: "sub3", subjectName: "Science" },
    { _id: "sub4", subjectName: "SST" },
    { _id: "sub6", subjectName: "Hindi" },
  ],
};

/**
 * ---------------------------
 * DEMO SUBJECT -> TEACHER ALLOCATION
 * key: `${classId}_${sectionId}_${subjectId}`
 * value: { teacherId, weeklyPeriods }
 * ---------------------------
 */
const DEMO_ALLOCATIONS = {
  // Class 8A
  "c3_s1_sub1": { teacherId: "t1", weeklyPeriods: 6 }, // Maths
  "c3_s1_sub2": { teacherId: "t2", weeklyPeriods: 5 }, // English
  "c3_s1_sub3": { teacherId: "t3", weeklyPeriods: 4 }, // Science
  "c3_s1_sub4": { teacherId: "t4", weeklyPeriods: 3 }, // SST
  "c3_s1_sub6": { teacherId: "t2", weeklyPeriods: 3 }, // Hindi (same teacher demo)

  // Class 8B
  "c3_s2_sub1": { teacherId: "t3", weeklyPeriods: 6 },
  "c3_s2_sub2": { teacherId: "t4", weeklyPeriods: 5 },
  "c3_s2_sub3": { teacherId: "t1", weeklyPeriods: 4 },
  "c3_s2_sub4": { teacherId: "t2", weeklyPeriods: 3 },
  "c3_s2_sub6": { teacherId: "t4", weeklyPeriods: 3 },

  // Class 7A
  "c2_s1_sub1": { teacherId: "t1", weeklyPeriods: 6 },
  "c2_s1_sub2": { teacherId: "t2", weeklyPeriods: 5 },
  "c2_s1_sub3": { teacherId: "t3", weeklyPeriods: 4 },
  "c2_s1_sub5": { teacherId: "t4", weeklyPeriods: 2 },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PERIODS = [
  { no: 1, time: "09:00 - 09:40" },
  { no: 2, time: "09:40 - 10:20" },
  { no: 3, time: "10:20 - 11:00" },
  { no: 4, time: "11:00 - 11:40" },
  { no: 5, time: "11:40 - 12:20" },
  { no: 6, time: "12:20 - 01:00" },
  { no: 7, time: "01:00 - 01:40" },
  { no: 8, time: "01:40 - 02:20" },
];

/**
 * ---------------------------
 * HELPERS
 * ---------------------------
 */
const getClassName = (classId) =>
  DEMO_CLASSES.find((c) => c._id === classId)?.className || "N/A";

const getSectionName = (sectionId) =>
  DEMO_SECTIONS.find((s) => s._id === sectionId)?.sectionName || "N/A";

const getTeacher = (teacherId) =>
  DEMO_TEACHERS.find((t) => t._id === teacherId) || null;

const getSubject = (classId, subjectId) =>
  (DEMO_SUBJECTS_BY_CLASS[classId] || []).find((s) => s._id === subjectId) ||
  null;

const makeCellKey = ({ classId, sectionId, day, periodNo }) =>
  `${classId}_${sectionId}_${day}_${periodNo}`;

const allocationKey = ({ classId, sectionId, subjectId }) =>
  `${classId}_${sectionId}_${subjectId}`;

/**
 * Check if teacher is busy at same day+period in ANY class/section.
 * Returns conflict object or null.
 */
function findTeacherClash({ timetable, teacherId, day, periodNo, ignoreKey }) {
  if (!teacherId) return null;

  for (const key of Object.keys(timetable)) {
    if (ignoreKey && key === ignoreKey) continue;

    const entry = timetable[key];
    if (!entry) continue;

    if (
      entry.teacherId === teacherId &&
      entry.day === day &&
      Number(entry.periodNo) === Number(periodNo)
    ) {
      return entry;
    }
  }
  return null;
}

function Exams() {
  const [classId, setClassId] = useState("c3");
  const [sectionId, setSectionId] = useState("s1");

  // This is like DB for timetable
  // key: `${classId}_${sectionId}_${day}_${periodNo}`
  // value: { classId, sectionId, day, periodNo, subjectId, teacherId }
  const [timetable, setTimetable] = useState(() => ({
    // Pre-filled demo entries (Class 8A)
    [makeCellKey({ classId: "c3", sectionId: "s1", day: "Mon", periodNo: 1 })]: {
      classId: "c3",
      sectionId: "s1",
      day: "Mon",
      periodNo: 1,
      subjectId: "sub1",
      teacherId: "t1",
    },
    [makeCellKey({ classId: "c3", sectionId: "s1", day: "Mon", periodNo: 2 })]: {
      classId: "c3",
      sectionId: "s1",
      day: "Mon",
      periodNo: 2,
      subjectId: "sub2",
      teacherId: "t2",
    },

    // Another class same teacher same slot (for clash demo)
    [makeCellKey({ classId: "c2", sectionId: "s1", day: "Mon", periodNo: 3 })]: {
      classId: "c2",
      sectionId: "s1",
      day: "Mon",
      periodNo: 3,
      subjectId: "sub1",
      teacherId: "t1",
    },
  }));

  // Modal / editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeCell, setActiveCell] = useState(null);

  // editor form
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const className = getClassName(classId);
  const sectionName = getSectionName(sectionId);

  const subjects = useMemo(() => {
    return DEMO_SUBJECTS_BY_CLASS[classId] || [];
  }, [classId]);

  const allocatedSubjects = useMemo(() => {
    // Only subjects that have teacher allocation
    return subjects.filter((s) => {
      const k = allocationKey({ classId, sectionId, subjectId: s._id });
      return !!DEMO_ALLOCATIONS[k]?.teacherId;
    });
  }, [subjects, classId, sectionId]);

  const stats = useMemo(() => {
    // Count filled cells for selected class+section only
    let filled = 0;
    for (const k of Object.keys(timetable)) {
      const e = timetable[k];
      if (e.classId === classId && e.sectionId === sectionId) filled++;
    }
    return { filled };
  }, [timetable, classId, sectionId]);

  const openEditor = (day, periodNo) => {
    const cellKey = makeCellKey({ classId, sectionId, day, periodNo });
    const existing = timetable[cellKey];

    setActiveCell({ day, periodNo, cellKey });

    if (existing) {
      setSubjectId(existing.subjectId);
      setTeacherId(existing.teacherId);
    } else {
      setSubjectId("");
      setTeacherId("");
    }

    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setActiveCell(null);
    setSubjectId("");
    setTeacherId("");
  };

  // Auto set teacher when subject changes (from allocation)
  useEffect(() => {
    if (!editorOpen) return;
    if (!subjectId) {
      setTeacherId("");
      return;
    }

    const k = allocationKey({ classId, sectionId, subjectId });
    const alloc = DEMO_ALLOCATIONS[k];

    if (alloc?.teacherId) setTeacherId(alloc.teacherId);
    else setTeacherId("");
  }, [subjectId, classId, sectionId, editorOpen]);

  const handleSave = async () => {
    if (!activeCell) return;

    if (!subjectId) {
      Swal.fire("Select subject", "Please select a subject.", "warning");
      return;
    }

    const kAlloc = allocationKey({ classId, sectionId, subjectId });
    const alloc = DEMO_ALLOCATIONS[kAlloc];

    if (!alloc?.teacherId) {
      Swal.fire(
        "No teacher allocated",
        "This subject has no teacher allocation for this class-section.",
        "error"
      );
      return;
    }

    // Force teacherId from allocation
    const finalTeacherId = alloc.teacherId;

    // Teacher clash check
    const clash = findTeacherClash({
      timetable,
      teacherId: finalTeacherId,
      day: activeCell.day,
      periodNo: activeCell.periodNo,
      ignoreKey: activeCell.cellKey,
    });

    if (clash) {
      const cName = getClassName(clash.classId);
      const sName = getSectionName(clash.sectionId);

      Swal.fire({
        icon: "error",
        title: "Teacher Clash!",
        html: `
          <div style="text-align:left">
            <b>${getTeacher(finalTeacherId)?.name}</b> is already assigned at:
            <br/>
            <br/>
            <b>${clash.day}</b> Period <b>${clash.periodNo}</b>
            <br/>
            <b>${cName} - ${sName}</b>
          </div>
        `,
      });
      return;
    }

    const entry = {
      classId,
      sectionId,
      day: activeCell.day,
      periodNo: activeCell.periodNo,
      subjectId,
      teacherId: finalTeacherId,
    };

    setTimetable((prev) => ({
      ...prev,
      [activeCell.cellKey]: entry,
    }));

    Swal.fire({
      icon: "success",
      title: "Saved!",
      timer: 1000,
      showConfirmButton: false,
    });

    closeEditor();
  };

  const handleDelete = async () => {
    if (!activeCell) return;

    const existing = timetable[activeCell.cellKey];
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

    setTimetable((prev) => {
      const copy = { ...prev };
      delete copy[activeCell.cellKey];
      return copy;
    });

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      timer: 900,
      showConfirmButton: false,
    });

    closeEditor();
  };

  const handleClearWholeTimetable = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Clear timetable?",
      text: `This will remove all periods for ${className} - ${sectionName}.`,
      showCancelButton: true,
      confirmButtonText: "Yes, clear",
    });

    if (!confirm.isConfirmed) return;

    setTimetable((prev) => {
      const copy = { ...prev };
      for (const key of Object.keys(copy)) {
        const e = copy[key];
        if (e.classId === classId && e.sectionId === sectionId) {
          delete copy[key];
        }
      }
      return copy;
    });

    Swal.fire({
      icon: "success",
      title: "Cleared!",
      timer: 900,
      showConfirmButton: false,
    });
  };

  const renderCell = (day, periodNo) => {
    const cellKey = makeCellKey({ classId, sectionId, day, periodNo });
    const entry = timetable[cellKey];

    if (!entry) {
      return (
        <button className="ttCell empty" onClick={() => openEditor(day, periodNo)}>
          <div className="ttEmptyText">
            <i className="bi bi-plus-circle"></i>
            <span>Add</span>
          </div>
        </button>
      );
    }

    const subject = getSubject(classId, entry.subjectId);
    const teacher = getTeacher(entry.teacherId);

    return (
      <button className="ttCell filled" onClick={() => openEditor(day, periodNo)}>
        <div className="ttSub">{subject?.subjectName || "N/A"}</div>
        <div className="ttTeacher">
          <i className="bi bi-person-badge"></i> {teacher?.name || "N/A"}
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
            Click any cell to assign subject. Teacher auto-fills from allocation.
          </p>
        </div>

        <div className="ttStats">
          <div className="ttStatCard">
            <div className="ttStatLabel">Selected</div>
            <div className="ttStatValue">
              {className} - {sectionName}
            </div>
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
            <select value={classId} onChange={(e) => setClassId(e.target.value)}>
              {DEMO_CLASSES.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.className}
                </option>
              ))}
            </select>
          </div>

          <div className="ttSelectBox">
            <label>Section</label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
            >
              {DEMO_SECTIONS.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.sectionName}
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
          <button className="btn btn-outline-danger" onClick={handleClearWholeTimetable}>
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

      {/* FOOTER NOTE */}
      <div className="ttFooter">
        Next step after timetable:{" "}
        <span className="fw-bold text-primary">
          Attendance + Teacher Substitution + Student Timetable View
        </span>
      </div>

      {/* EDITOR MODAL */}
      {editorOpen && activeCell && (
        <div className="ttModalOverlay" onClick={closeEditor}>
          <div className="ttModal" onClick={(e) => e.stopPropagation()}>
            <div className="ttModalHeader">
              <div>
                <h5 className="mb-0 fw-bold">Edit Period</h5>
                <div className="text-muted">
                  {className} - {sectionName} • {activeCell.day} • Period{" "}
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
                      {s.subjectName}
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
                  value={teacherId ? getTeacher(teacherId)?.name : ""}
                  readOnly
                  placeholder="Auto from allocation..."
                />
                <small className="text-muted">
                  Teacher is auto-selected from subject allocation.
                </small>
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

export default Exams;