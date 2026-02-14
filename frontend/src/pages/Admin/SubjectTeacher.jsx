import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./css/Attendence.css";

const DEMO_CLASSES = [
  { _id: "c1", className: "Class 6" },
  { _id: "c2", className: "Class 7" },
  { _id: "c3", className: "Class 8" },
];

const DEMO_SECTIONS = [
  { _id: "s1", sectionName: "A" },
  { _id: "s2", sectionName: "B" },
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

const DEMO_TEACHERS = [
  { _id: "t1", name: "Rahul Sharma", email: "rahul@school.com" },
  { _id: "t2", name: "Neha Verma", email: "neha@school.com" },
  { _id: "t3", name: "Amit Singh", email: "amit@school.com" },
  { _id: "t4", name: "Pooja Gupta", email: "pooja@school.com" },
];

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
  const [classId, setClassId] = useState("c3");
  const [sectionId, setSectionId] = useState("s1");

  // demo allocation state (this simulates DB)
  // key: `${classId}_${sectionId}_${subjectId}` => { teacherId, weeklyPeriods }
  const [allocations, setAllocations] = useState(() => ({
    "c3_s1_sub1": { teacherId: "t1", weeklyPeriods: 6 }, // class 8 A maths
    "c3_s1_sub2": { teacherId: "t2", weeklyPeriods: 5 }, // class 8 A eng
    "c3_s2_sub1": { teacherId: "t3", weeklyPeriods: 6 }, // class 8 B maths
  }));

  // local UI states
  const [search, setSearch] = useState("");
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  const subjects = useMemo(() => {
    return DEMO_SUBJECTS_BY_CLASS[classId] || [];
  }, [classId]);

  const filteredSubjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) => s.subjectName.toLowerCase().includes(q));
  }, [subjects, search]);

  const allocationList = useMemo(() => {
    return subjects.map((sub) => {
      const key = `${classId}_${sectionId}_${sub._id}`;
      const row = allocations[key];
      const teacher = row
        ? DEMO_TEACHERS.find((t) => t._id === row.teacherId)
        : null;

      return {
        key,
        subjectId: sub._id,
        subjectName: sub.subjectName,
        teacherId: row?.teacherId || "",
        teacherName: teacher?.name || "",
        teacherEmail: teacher?.email || "",
        weeklyPeriods: row?.weeklyPeriods ?? 0,
      };
    });
  }, [subjects, allocations, classId, sectionId]);

  const allocatedCount = useMemo(() => {
    return allocationList.filter((x) => x.teacherId).length;
  }, [allocationList]);

  const selectedClassName =
    DEMO_CLASSES.find((c) => c._id === classId)?.className || "N/A";
  const selectedSectionName =
    DEMO_SECTIONS.find((s) => s._id === sectionId)?.sectionName || "N/A";

  const handleAllocate = async ({ subjectId, teacherId, weeklyPeriods }) => {
    if (!teacherId) {
      Swal.fire("Select teacher", "Please select a teacher first.", "warning");
      return;
    }

    const key = `${classId}_${sectionId}_${subjectId}`;

    setAllocations((prev) => ({
      ...prev,
      [key]: {
        teacherId,
        weeklyPeriods: Number(weeklyPeriods || 0),
      },
    }));

    Swal.fire({
      icon: "success",
      title: "Allocated!",
      text: "Teacher assigned to subject successfully.",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleRemove = async ({ subjectId }) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "Remove allocation?",
      text: "This will remove teacher from this subject.",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });

    if (!confirm.isConfirmed) return;

    const key = `${classId}_${sectionId}_${subjectId}`;

    setAllocations((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    Swal.fire({
      icon: "success",
      title: "Removed!",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  // reset expanded panel when class/section changes
  useEffect(() => {
    setExpandedSubjectId(null);
    setSearch("");
  }, [classId, sectionId]);

  return (
    <div className="pageWrap">
      {/* TOP HEADER */}
      <div className="erpHeader">
        <div>
          <h3 className="mb-1 fw-bold text-primary">
            Subject ↔ Teacher Allocation
          </h3>
          <p className="mb-0 text-muted">
            Allocate teachers to subjects class & section wise (Demo UI).
          </p>
        </div>

        <div className="headerStats">
          <div className="statCard">
            <div className="statLabel">Selected</div>
            <div className="statValue">
              {selectedClassName} - {selectedSectionName}
            </div>
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

      {/* FILTER BAR */}
      <div className="filterBar">
        <div className="filterLeft">
          <div className="selectBox">
            <label>Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              {DEMO_CLASSES.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.className}
                </option>
              ))}
            </select>
          </div>

          <div className="selectBox">
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

        <div className="filterRight">
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              Swal.fire({
                icon: "info",
                title: "Demo Mode",
                text: "This page is running with demo data. No backend required.",
              });
            }}
          >
            <i className="bi bi-info-circle me-1"></i> Demo Info
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="gridWrap">
        {/* LEFT: SUBJECT LIST */}
        <div className="panel">
          <div className="panelHeader">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-journal-bookmark-fill me-2 text-primary"></i>
              Allocated Subjects in {selectedClassName}
            </h5>
            <span className="pill">{filteredSubjects.length} subjects</span>
          </div>

          <div className="panelBody">
            {filteredSubjects.length === 0 ? (
              <div className="emptyState">
                <i className="bi bi-emoji-frown"></i>
                <p className="mb-0 fw-semibold">No subjects found</p>
                <small className="text-muted">
                  Try searching with a different keyword.
                </small>
              </div>
            ) : (
              filteredSubjects.map((sub, idx) => {
                const key = `${classId}_${sectionId}_${sub._id}`;
                const alloc = allocations[key];
                const teacher = alloc
                  ? DEMO_TEACHERS.find((t) => t._id === alloc.teacherId)
                  : null;

                const isExpanded = expandedSubjectId === sub._id;

                return (
                  <div
                    key={sub._id}
                    className={`subjectCard ${isExpanded ? "active" : ""}`}
                    onClick={() =>
                      setExpandedSubjectId((prev) =>
                        prev === sub._id ? null : sub._id
                      )
                    }
                  >
                    <div className="subjectTop">
                      <div className="subjectName">
                        <span className={`dot ${badgeColor(idx)}`}></span>
                        <span className="fw-bold">{sub.subjectName}</span>
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
                      {teacher ? (
                        <div className="metaRow">
                          <span className="metaLabel">Teacher:</span>
                          <span className="metaValue">{teacher.name}</span>
                        </div>
                      ) : (
                        <div className="metaRow">
                          <span className="metaLabel">Teacher:</span>
                          <span className="metaValue text-muted">
                            Not assigned
                          </span>
                        </div>
                      )}

                      <div className="metaRow">
                        <span className="metaLabel">Weekly Periods:</span>
                        <span className="metaValue">
                          {alloc?.weeklyPeriods ?? 0}
                        </span>
                      </div>
                    </div>

                    {/* EXPANDED EDIT PANEL */}
                    {isExpanded && (
                      <SubjectAllocateEditor
                        subject={sub}
                        classId={classId}
                        sectionId={sectionId}
                        allocations={allocations}
                        setAllocations={setAllocations}
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

        {/* RIGHT: TABLE VIEW */}
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
                  {allocationList.map((row) => {
                    const hasTeacher = !!row.teacherId;
                    return (
                      <tr key={row.key}>
                        <td className="fw-semibold">{row.subjectName}</td>
                        <td>
                          {hasTeacher ? (
                            <div>
                              <div className="fw-semibold">
                                {row.teacherName}
                              </div>
                              <small className="text-muted">
                                {row.teacherEmail}
                              </small>
                            </div>
                          ) : (
                            <span className="text-muted">Not allocated</span>
                          )}
                        </td>
                        <td>
                          <span className="periodBadge">
                            {row.weeklyPeriods}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setExpandedSubjectId(row.subjectId)}
                            >
                              <i className="bi bi-pencil-square me-1"></i> Edit
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              disabled={!hasTeacher}
                              onClick={() =>
                                handleRemove({ subjectId: row.subjectId })
                              }
                            >
                              <i className="bi bi-trash3 me-1"></i> Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {allocationList.length === 0 && (
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
                  Click any subject card to allocate a teacher, or use the table
                  edit button.
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

function SubjectAllocateEditor({
  subject,
  classId,
  sectionId,
  allocations,
  onAllocate,
  onRemove,
}) {
  const key = `${classId}_${sectionId}_${subject._id}`;
  const existing = allocations[key];

  const [teacherId, setTeacherId] = useState(existing?.teacherId || "");
  const [weeklyPeriods, setWeeklyPeriods] = useState(
    existing?.weeklyPeriods ?? 0
  );

  useEffect(() => {
    setTeacherId(existing?.teacherId || "");
    setWeeklyPeriods(existing?.weeklyPeriods ?? 0);
  }, [existing?.teacherId, existing?.weeklyPeriods]);

  const teacher = teacherId
    ? DEMO_TEACHERS.find((t) => t._id === teacherId)
    : null;

  return (
    <div className="editorBox" onClick={(e) => e.stopPropagation()}>
      <div className="editorGrid">
        <div className="field">
          <label>Teacher</label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option value="">-- Select Teacher --</option>
            {DEMO_TEACHERS.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          {teacher && (
            <small className="text-muted">
              <i className="bi bi-envelope me-1"></i>
              {teacher.email}
            </small>
          )}
        </div>

        <div className="field">
          <label>Weekly Periods</label>
          <input
            type="number"
            min="0"
            value={weeklyPeriods}
            onChange={(e) => setWeeklyPeriods(e.target.value)}
            placeholder="0"
          />
          <small className="text-muted">Optional</small>
        </div>
      </div>

      <div className="editorActions">
        <button
          className="btn btn-sm btn-primary"
          onClick={() =>
            onAllocate({
              subjectId: subject._id,
              teacherId,
              weeklyPeriods,
            })
          }
        >
          <i className="bi bi-check2-circle me-1"></i>
          Save Allocation
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