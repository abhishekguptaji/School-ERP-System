import { useMemo, useState } from "react";

function Results() {
  // Demo Student Info
  const studentInfo = {
    name: "Abhishek",
    rollNo: "100",
    className: "B.Tech",
    semester: "Semester 5",
    section: "A",
  };

  // Demo Results (API se replace)
  const results = [
    {
      id: 1,
      semester: "Semester 5",
      publishedAt: "2026-02-10",
      status: "Published",
      summary: {
        totalMarks: 500,
        obtainedMarks: 412,
        percentage: 82.4,
        cgpa: 8.4,
        result: "Pass",
      },
      subjects: [
        {
          code: "KCS502",
          name: "Compiler Design",
          max: 100,
          obtained: 88,
          grade: "A",
          status: "Pass",
        },
        {
          code: "KCS501",
          name: "Operating System",
          max: 100,
          obtained: 79,
          grade: "B+",
          status: "Pass",
        },
        {
          code: "KCS503",
          name: "DBMS",
          max: 100,
          obtained: 81,
          grade: "A-",
          status: "Pass",
        },
        {
          code: "KCS504",
          name: "Computer Networks",
          max: 100,
          obtained: 76,
          grade: "B+",
          status: "Pass",
        },
        {
          code: "KCS505",
          name: "Software Engineering",
          max: 100,
          obtained: 88,
          grade: "A",
          status: "Pass",
        },
      ],
    },
    {
      id: 2,
      semester: "Semester 4",
      publishedAt: "2025-08-20",
      status: "Published",
      summary: {
        totalMarks: 500,
        obtainedMarks: 390,
        percentage: 78.0,
        cgpa: 7.9,
        result: "Pass",
      },
      subjects: [
        {
          code: "KCS401",
          name: "DBMS",
          max: 100,
          obtained: 82,
          grade: "A-",
          status: "Pass",
        },
        {
          code: "KCS402",
          name: "Operating System",
          max: 100,
          obtained: 74,
          grade: "B+",
          status: "Pass",
        },
        {
          code: "KCS403",
          name: "Discrete Mathematics",
          max: 100,
          obtained: 77,
          grade: "B+",
          status: "Pass",
        },
        {
          code: "KCS404",
          name: "OOPs with Java",
          max: 100,
          obtained: 81,
          grade: "A-",
          status: "Pass",
        },
        {
          code: "KCS405",
          name: "Microprocessor",
          max: 100,
          obtained: 76,
          grade: "B+",
          status: "Pass",
        },
      ],
    },
  ];

  const [selectedSemester, setSelectedSemester] = useState("Semester 5");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const semesterOptions = useMemo(() => {
    return Array.from(new Set(results.map((r) => r.semester)));
  }, [results]);

  const currentResult = useMemo(() => {
    return results.find((r) => r.semester === selectedSemester);
  }, [results, selectedSemester]);

  const resultBadge = (status) => {
    if (status === "Pass") return "success";
    if (status === "Fail") return "danger";
    return "secondary";
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              <i className="bi bi-award-fill text-primary me-2"></i>
              Result
            </h3>
            <div className="text-muted">
              View your semester results and subject marks
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

        {/* FILTER */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Select Semester
                </label>
                <select
                  className="form-select"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  {semesterOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 d-flex align-items-end">
                <button className="btn btn-primary w-100 rounded-3 py-2 fw-semibold">
                  <i className="bi bi-download me-2"></i>
                  Download Result (PDF)
                </button>
              </div>
            </div>

            <div className="alert alert-light border rounded-4 small mt-3 mb-0">
              <i className="bi bi-info-circle me-2"></i>
              If result is not showing, it may not be published yet.
            </div>
          </div>
        </div>

        {/* SUMMARY + TABLE */}
        {!currentResult ? (
          <div className="alert alert-info rounded-4 border">
            <i className="bi bi-info-circle me-2"></i>
            No result found for selected semester.
          </div>
        ) : (
          <div className="row g-4">
            {/* SUMMARY */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-bar-chart-fill text-primary me-2"></i>
                    Result Summary
                  </h5>

                  <div className="d-flex flex-column gap-3">
                    <div className="border rounded-4 p-3 bg-light">
                      <div className="text-muted small">Published At</div>
                      <div className="fw-bold">{currentResult.publishedAt}</div>
                    </div>

                    <div className="border rounded-4 p-3 bg-light">
                      <div className="text-muted small">Total Marks</div>
                      <div className="fw-bold">
                        {currentResult.summary.obtainedMarks} /{" "}
                        {currentResult.summary.totalMarks}
                      </div>
                    </div>

                    <div className="border rounded-4 p-3 bg-light">
                      <div className="text-muted small">Percentage</div>
                      <div className="fw-bold">
                        {currentResult.summary.percentage}%
                      </div>
                    </div>

                    <div className="border rounded-4 p-3 bg-light">
                      <div className="text-muted small">CGPA</div>
                      <div className="fw-bold">{currentResult.summary.cgpa}</div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center border rounded-4 p-3 bg-white">
                      <div className="fw-semibold">Final Result</div>
                      <span
                        className={`badge text-bg-${resultBadge(
                          currentResult.summary.result
                        )} rounded-pill px-3 py-2`}
                      >
                        {currentResult.summary.result}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBJECT TABLE */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-journal-text text-primary me-2"></i>
                      Subject Marks
                    </h5>

                    <span className="badge text-bg-light border text-dark rounded-pill">
                      {currentResult.subjects.length} Subjects
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr className="text-muted">
                          <th>Code</th>
                          <th>Subject</th>
                          <th className="text-center">Max</th>
                          <th className="text-center">Obtained</th>
                          <th className="text-center">Grade</th>
                          <th className="text-center">Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentResult.subjects.map((sub) => (
                          <tr key={sub.code}>
                            <td className="fw-semibold">{sub.code}</td>
                            <td>{sub.name}</td>
                            <td className="text-center">{sub.max}</td>
                            <td className="text-center fw-bold">
                              {sub.obtained}
                            </td>
                            <td className="text-center">
                              <span className="badge text-bg-primary rounded-pill">
                                {sub.grade}
                              </span>
                            </td>
                            <td className="text-center">
                              <span
                                className={`badge text-bg-${resultBadge(
                                  sub.status
                                )} rounded-pill`}
                              >
                                {sub.status}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-outline-primary btn-sm rounded-3"
                                onClick={() => setSelectedSubject(sub)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="small text-muted mt-2">
                    <i className="bi bi-lightbulb me-2"></i>
                    Tip: Click “View” to see subject details.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SUBJECT MODAL */}
      {selectedSubject && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {selectedSubject.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedSubject(null)}
                ></button>
              </div>

              <div className="modal-body pt-2">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge text-bg-light border text-dark rounded-pill">
                    Code: <b>{selectedSubject.code}</b>
                  </span>

                  <span className="badge text-bg-primary rounded-pill">
                    Grade: {selectedSubject.grade}
                  </span>

                  <span
                    className={`badge text-bg-${resultBadge(
                      selectedSubject.status
                    )} rounded-pill`}
                  >
                    {selectedSubject.status}
                  </span>
                </div>

                <div className="p-3 bg-light rounded-4">
                  <div className="text-muted small">Marks</div>
                  <div className="fw-bold fs-5">
                    {selectedSubject.obtained} / {selectedSubject.max}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary rounded-3"
                  onClick={() => setSelectedSubject(null)}
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

export default Results;
