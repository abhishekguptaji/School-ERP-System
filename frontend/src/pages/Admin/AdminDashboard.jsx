import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


const dashboardDemoData = {
  summary: {
    totalStudents: 1280,
    totalTeachers: 78,
    totalStaff: 34,
    totalClasses: 18,
    totalSections: 42,
    totalSubjects: 62,
    todayStudentAttendancePercent: 92.4,
    todayTeacherAttendancePercent: 96.1,
    pendingFeesAmount: 684250,
    pendingGrievancesCount: 12,
    pendingAdmissionsRequests: 9,
    todayCollections: 94250,
  },
  quickActions: [
    { label: "Add Student", icon: "bi-person-plus", to: "/admin/students/create" },
    { label: "Add Teacher", icon: "bi-person-badge", to: "/admin/teachers/create" },
    { label: "Create Class/Section", icon: "bi-diagram-3", to: "/admin/classes" },
    { label: "Allocate Subjects", icon: "bi-journal-check", to: "/admin/subjects/allocate" },
    { label: "Allocate Class Teacher", icon: "bi-person-workspace", to: "/admin/class-teachers" },
    { label: "Create Time Table", icon: "bi-calendar-week", to: "/admin/timetable" },
    { label: "Upload Study Material", icon: "bi-cloud-upload", to: "/admin/study-material" },
    { label: "Create Notice", icon: "bi-megaphone", to: "/admin/notices/create" },
    { label: "Generate Fee Invoice", icon: "bi-receipt", to: "/admin/fees/invoices" },
    { label: "View Reports", icon: "bi-bar-chart", to: "/admin/reports" },
  ],
  attendanceOverview: {
    date: "2026-02-15",
    todayStudent: { present: 1183, absent: 97, leave: 21, percent: 92.4 },
    todayTeacher: { present: 75, absent: 3, leave: 1, percent: 96.1 },
    absentStudentsTop5: [
      { name: "Aarav Sharma", class: "10", section: "A", rollNo: 12, reason: "Sick" },
      { name: "Ananya Singh", class: "9", section: "C", rollNo: 7, reason: "Not Informed" },
      { name: "Rohan Verma", class: "8", section: "B", rollNo: 19, reason: "Leave" },
      { name: "Ishita Gupta", class: "12", section: "A", rollNo: 3, reason: "Medical" },
      { name: "Aditya Yadav", class: "11", section: "B", rollNo: 28, reason: "Not Informed" },
    ],
    absentTeachersTop5: [
      { name: "Neha Mehta", department: "English", reason: "Leave" },
      { name: "Vikram Joshi", department: "Maths", reason: "Not Informed" },
      { name: "Pooja Nair", department: "Science", reason: "Sick" },
    ],
  },
  feesOverview: {
    totalFeesDue: 684250,
    totalFeesPaid: 5123750,
    todayCollection: 94250,
    monthlyCollection: [
      { month: "Aug", amount: 410000 },
      { month: "Sep", amount: 455000 },
      { month: "Oct", amount: 520000 },
      { month: "Nov", amount: 610000 },
      { month: "Dec", amount: 575000 },
      { month: "Jan", amount: 690000 },
      { month: "Feb", amount: 320000 },
    ],
    topDefaulters: [
      { name: "Rahul Kumar", class: "12", section: "B", due: 28500, lastPaid: "2025-10-18" },
      { name: "Simran Kaur", class: "11", section: "A", due: 24200, lastPaid: "2025-11-02" },
      { name: "Mohit Sharma", class: "10", section: "C", due: 19800, lastPaid: "2025-12-07" },
      { name: "Sneha Patel", class: "9", section: "B", due: 17600, lastPaid: "2026-01-10" },
      { name: "Kunal Verma", class: "8", section: "A", due: 15100, lastPaid: "2026-01-05" },
    ],
  },
  grievanceOverview: {
    pending: 12,
    open: 7,
    resolved: 54,
    latest5: [
      {
        ticketId: "GRV-1042",
        raisedBy: "Student",
        name: "Aarav Sharma",
        class: "10-A",
        priority: "Urgent",
        status: "Pending",
        createdAt: "2026-02-15 09:12",
      },
      {
        ticketId: "GRV-1041",
        raisedBy: "Teacher",
        name: "Neha Mehta",
        class: "—",
        priority: "Important",
        status: "Open",
        createdAt: "2026-02-14 15:40",
      },
      {
        ticketId: "GRV-1040",
        raisedBy: "Student",
        name: "Ananya Singh",
        class: "9-C",
        priority: "Normal",
        status: "Resolved",
        createdAt: "2026-02-14 12:10",
      },
      {
        ticketId: "GRV-1039",
        raisedBy: "Student",
        name: "Rohan Verma",
        class: "8-B",
        priority: "Important",
        status: "Open",
        createdAt: "2026-02-13 11:25",
      },
      {
        ticketId: "GRV-1038",
        raisedBy: "Teacher",
        name: "Vikram Joshi",
        class: "—",
        priority: "Normal",
        status: "Pending",
        createdAt: "2026-02-13 10:05",
      },
    ],
  },
  noticesOverview: {
    latest5: [
      { id: "NTC-221", title: "Unit Test Schedule Released", category: "Exam", createdAt: "2026-02-15" },
      { id: "NTC-220", title: "Fee Submission Deadline Extended", category: "Fees", createdAt: "2026-02-14" },
      { id: "NTC-219", title: "Annual Sports Day Announcement", category: "General", createdAt: "2026-02-13" },
      { id: "NTC-218", title: "Urgent: School Timing Change Tomorrow", category: "Urgent", createdAt: "2026-02-12" },
      { id: "NTC-217", title: "Science Exhibition Registration Open", category: "General", createdAt: "2026-02-11" },
    ],
  },
  timetableAcademicSummary: {
    totalSubjectsAllocated: 56,
    totalUnallocatedSubjects: 6,
    teachersWithoutTimetable: 4,
    classesWithMissingTimetable: ["6-C", "9-B", "11-A"],
  },
  admissionTracking: {
    newRequests: 9,
    pendingDocumentVerification: 6,
    approved: 31,
    rejected: 2,
    latestRequests: [
      { appId: "ADM-3009", name: "Riya Sharma", appliedFor: "6-A", status: "Pending Docs", createdAt: "2026-02-15" },
      { appId: "ADM-3008", name: "Kabir Singh", appliedFor: "9-B", status: "New", createdAt: "2026-02-14" },
      { appId: "ADM-3007", name: "Isha Verma", appliedFor: "11-A", status: "Approved", createdAt: "2026-02-13" },
    ],
  },
  reportsQuickLinks: [
    { title: "Attendance Report", to: "/admin/reports/attendance", icon: "bi-clipboard-check" },
    { title: "Fee Report", to: "/admin/reports/fees", icon: "bi-cash-coin" },
    { title: "Exam Report", to: "/admin/reports/exams", icon: "bi-journal-text" },
    { title: "Student Strength", to: "/admin/reports/strength", icon: "bi-people" },
    { title: "Teacher Workload", to: "/admin/reports/workload", icon: "bi-person-lines-fill" },
    { title: "Class-wise Subjects", to: "/admin/reports/class-subjects", icon: "bi-book" },
  ],
  charts: {
    monthlyFeeCollection: [
      { month: "Aug", value: 410000 },
      { month: "Sep", value: 455000 },
      { month: "Oct", value: 520000 },
      { month: "Nov", value: 610000 },
      { month: "Dec", value: 575000 },
      { month: "Jan", value: 690000 },
      { month: "Feb", value: 320000 },
    ],
    attendanceTrendWeekly: [
      { day: "Mon", students: 93.1, teachers: 97.4 },
      { day: "Tue", students: 91.8, teachers: 96.9 },
      { day: "Wed", students: 92.9, teachers: 97.2 },
      { day: "Thu", students: 90.6, teachers: 95.7 },
      { day: "Fri", students: 94.2, teachers: 97.9 },
      { day: "Sat", students: 89.5, teachers: 94.2 },
    ],
    classWiseStrength: [
      { classLabel: "1", students: 64 },
      { classLabel: "2", students: 72 },
      { classLabel: "3", students: 68 },
      { classLabel: "4", students: 70 },
      { classLabel: "5", students: 74 },
      { classLabel: "6", students: 80 },
      { classLabel: "7", students: 78 },
      { classLabel: "8", students: 86 },
      { classLabel: "9", students: 90 },
      { classLabel: "10", students: 92 },
      { classLabel: "11", students: 86 },
      { classLabel: "12", students: 80 },
    ],
    grievanceStatusDistribution: [
      { name: "Pending", value: 12 },
      { name: "Open", value: 7 },
      { name: "Resolved", value: 54 },
    ],
    teacherWorkloadDistribution: [
      { range: "0-10 periods", teachers: 8 },
      { range: "11-20 periods", teachers: 26 },
      { range: "21-30 periods", teachers: 33 },
      { range: "31-40 periods", teachers: 11 },
    ],
  },
};

// Helpers
const formatINR = (value) => {
  if (value === null || value === undefined) return "₹0";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  } catch {
    return `₹${value}`;
  }
};

const badgeByPriority = (priority) => {
  const p = String(priority || "").toLowerCase();
  if (p === "urgent") return "bg-danger";
  if (p === "important") return "bg-warning text-dark";
  return "bg-secondary";
};

const badgeByStatus = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "resolved") return "bg-success";
  if (s === "open") return "bg-primary";
  if (s === "pending") return "bg-warning text-dark";
  return "bg-secondary";
};

const noticeBadge = (category) => {
  const c = String(category || "").toLowerCase();
  if (c === "urgent") return "bg-danger";
  if (c === "exam") return "bg-primary";
  if (c === "fees") return "bg-warning text-dark";
  return "bg-secondary";
};

const cardIconBg = (key) => {
  // Keep it Bootstrap-safe. No custom colors.
  if (["pendingFeesAmount", "todayCollections"].includes(key)) return "bg-warning";
  if (["pendingGrievancesCount"].includes(key)) return "bg-danger";
  if (["pendingAdmissionsRequests"].includes(key)) return "bg-info";
  if (["todayStudentAttendancePercent", "todayTeacherAttendancePercent"].includes(key)) return "bg-success";
  return "bg-primary";
};

const SummaryCard = ({ title, value, icon, iconBg = "bg-primary", subtitle }) => {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div className="card border-0 shadow-sm h-100 rounded-4">
        <div className="card-body p-3">
          <div className="d-flex align-items-start justify-content-between gap-3">
            <div>
              <div className="text-muted small">{title}</div>
              <div className="fs-4 fw-bold mt-1">{value}</div>
              {subtitle ? <div className="small text-muted mt-1">{subtitle}</div> : null}
            </div>
            <div className={`rounded-4 ${iconBg} bg-opacity-25 p-3 d-flex align-items-center justify-content-center`}>
              <i className={`bi ${icon} fs-4`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon, right, children }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-header bg-white border-0 rounded-top-4 p-3">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="rounded-3 bg-primary bg-opacity-10 p-2 d-inline-flex align-items-center justify-content-center">
              <i className={`bi ${icon} text-primary`}></i>
            </span>
            <h6 className="mb-0 fw-bold">{title}</h6>
          </div>
          {right}
        </div>
      </div>
      <div className="card-body p-3">{children}</div>
    </div>
  );
};

 function AdminDashboard() {
  const [range, setRange] = useState("This Month");

  const data = dashboardDemoData;

  const summaryCards = useMemo(() => {
    const s = data.summary;

    return [
      {
        key: "totalStudents",
        title: "Total Students",
        value: s.totalStudents,
        icon: "bi-people-fill",
      },
      {
        key: "totalTeachers",
        title: "Total Teachers",
        value: s.totalTeachers,
        icon: "bi-person-badge-fill",
      },
      {
        key: "totalStaff",
        title: "Total Staff",
        value: s.totalStaff,
        icon: "bi-person-workspace",
      },
      {
        key: "totalClasses",
        title: "Total Classes",
        value: s.totalClasses,
        icon: "bi-building",
      },
      {
        key: "totalSections",
        title: "Total Sections",
        value: s.totalSections,
        icon: "bi-diagram-3-fill",
      },
      {
        key: "totalSubjects",
        title: "Total Subjects",
        value: s.totalSubjects,
        icon: "bi-book-fill",
      },
      {
        key: "todayStudentAttendancePercent",
        title: "Student Attendance",
        value: `${s.todayStudentAttendancePercent}%`,
        icon: "bi-check2-circle",
        subtitle: "Today",
      },
      {
        key: "todayTeacherAttendancePercent",
        title: "Teacher Attendance",
        value: `${s.todayTeacherAttendancePercent}%`,
        icon: "bi-check2-all",
        subtitle: "Today",
      },
      {
        key: "pendingFeesAmount",
        title: "Pending Fees",
        value: formatINR(s.pendingFeesAmount),
        icon: "bi-cash-coin",
      },
      {
        key: "pendingGrievancesCount",
        title: "Pending Grievances",
        value: s.pendingGrievancesCount,
        icon: "bi-exclamation-triangle-fill",
      },
      {
        key: "pendingAdmissionsRequests",
        title: "Pending Admissions",
        value: s.pendingAdmissionsRequests,
        icon: "bi-person-vcard",
      },
      {
        key: "todayCollections",
        title: "Today Collections",
        value: formatINR(s.todayCollections),
        icon: "bi-receipt-cutoff",
        subtitle: range,
      },
    ];
  }, [data, range]);

  return (
    <div className="container-fluid py-3">
      {/* Header */}
      <div className="d-flex align-items-start align-items-md-center justify-content-between flex-wrap gap-2 mb-3">
        <div>
          <h4 className="mb-0 fw-bold text-primary">Admin Dashboard</h4>
          <div className="text-muted small">School ERP • Overview & Quick Actions</div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="btn-group">
            <button
              className="btn btn-outline-primary dropdown-toggle rounded-4"
              data-bs-toggle="dropdown"
              type="button"
            >
              <i className="bi bi-calendar3 me-2"></i>
              {range}
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              {["Today", "This Week", "This Month", "This Year"].map((r) => (
                <li key={r}>
                  <button className="dropdown-item" onClick={() => setRange(r)}>
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn btn-primary rounded-4">
            <i className="bi bi-arrow-repeat me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-3">
        {summaryCards.map((c) => (
          <SummaryCard
            key={c.key}
            title={c.title}
            value={c.value}
            icon={c.icon}
            subtitle={c.subtitle}
            iconBg={cardIconBg(c.key)}
          />
        ))}
      </div>

      {/* Quick Actions + Alerts */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-xl-8">
          <SectionCard
            title="Quick Actions"
            icon="bi-lightning-charge-fill"
            right={<span className="badge bg-primary bg-opacity-10 text-primary">Admin</span>}
          >
            <div className="row g-2">
              {data.quickActions.map((a) => (
                <div className="col-12 col-sm-6 col-lg-4" key={a.label}>
                  <Link
                    to={a.to}
                    className="text-decoration-none"
                    style={{ display: "block" }}
                  >
                    <div className="border rounded-4 p-3 h-100 d-flex align-items-center gap-3 hover-shadow">
                      <div className="rounded-4 bg-primary bg-opacity-10 p-2 d-flex align-items-center justify-content-center">
                        <i className={`bi ${a.icon} text-primary fs-4`}></i>
                      </div>
                      <div className="fw-semibold text-dark">{a.label}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="col-12 col-xl-4">
          <SectionCard title="System Alerts" icon="bi-bell-fill">
            <div className="d-flex flex-column gap-2">
              <div className="alert alert-warning rounded-4 mb-0">
                <i className="bi bi-exclamation-circle me-2"></i>
                Timetable missing for: <b>{data.timetableAcademicSummary.classesWithMissingTimetable.join(", ")}</b>
              </div>
              <div className="alert alert-danger rounded-4 mb-0">
                <i className="bi bi-cash-stack me-2"></i>
                Pending fees: <b>{formatINR(data.summary.pendingFeesAmount)}</b>
              </div>
              <div className="alert alert-info rounded-4 mb-0">
                <i className="bi bi-person-lines-fill me-2"></i>
                Teachers without timetable: <b>{data.timetableAcademicSummary.teachersWithoutTimetable}</b>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-xl-7">
          <SectionCard
            title="Monthly Fee Collection"
            icon="bi-graph-up-arrow"
            right={<span className="text-muted small">Last 7 months</span>}
          >
            <div style={{ width: "100%", height: 290 }}>
              <ResponsiveContainer>
                <AreaChart data={data.charts.monthlyFeeCollection} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => formatINR(v)} />
                  <Area type="monotone" dataKey="value" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <div className="col-12 col-xl-5">
          <SectionCard title="Weekly Attendance Trend" icon="bi-activity">
            <div style={{ width: "100%", height: 290 }}>
              <ResponsiveContainer>
                <BarChart data={data.charts.attendanceTrendWeekly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                  <Bar dataKey="students" />
                  <Bar dataKey="teachers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Attendance + Fees */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-xl-6">
          <SectionCard title="Attendance Overview" icon="bi-clipboard-check">
            <div className="row g-3">
              <div className="col-12 col-lg-6">
                <div className="border rounded-4 p-3 h-100">
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="fw-bold">Students</div>
                      <div className="text-muted small">Today</div>
                    </div>
                    <span className="badge bg-success">{data.attendanceOverview.todayStudent.percent}%</span>
                  </div>

                  <div className="mt-3 d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Present</span>
                      <b>{data.attendanceOverview.todayStudent.present}</b>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Absent</span>
                      <b>{data.attendanceOverview.todayStudent.absent}</b>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Leave</span>
                      <b>{data.attendanceOverview.todayStudent.leave}</b>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="border rounded-4 p-3 h-100">
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="fw-bold">Teachers</div>
                      <div className="text-muted small">Today</div>
                    </div>
                    <span className="badge bg-success">{data.attendanceOverview.todayTeacher.percent}%</span>
                  </div>

                  <div className="mt-3 d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Present</span>
                      <b>{data.attendanceOverview.todayTeacher.present}</b>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Absent</span>
                      <b>{data.attendanceOverview.todayTeacher.absent}</b>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Leave</span>
                      <b>{data.attendanceOverview.todayTeacher.leave}</b>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <div className="border rounded-4 p-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="fw-bold">Absent Students</div>
                        <Link className="small text-decoration-none" to="/admin/attendance/students">
                          View All
                        </Link>
                      </div>
                      <div className="table-responsive mt-2">
                        <table className="table table-sm align-middle mb-0">
                          <thead>
                            <tr className="text-muted small">
                              <th>Name</th>
                              <th>Class</th>
                              <th>Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.attendanceOverview.absentStudentsTop5.map((s, idx) => (
                              <tr key={idx}>
                                <td className="fw-semibold">{s.name}</td>
                                <td>
                                  {s.class}-{s.section}
                                </td>
                                <td>
                                  <span className="badge bg-light text-dark border">{s.reason}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="border rounded-4 p-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="fw-bold">Absent Teachers</div>
                        <Link className="small text-decoration-none" to="/admin/attendance/teachers">
                          View All
                        </Link>
                      </div>
                      <div className="table-responsive mt-2">
                        <table className="table table-sm align-middle mb-0">
                          <thead>
                            <tr className="text-muted small">
                              <th>Name</th>
                              <th>Dept</th>
                              <th>Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.attendanceOverview.absentTeachersTop5.map((t, idx) => (
                              <tr key={idx}>
                                <td className="fw-semibold">{t.name}</td>
                                <td>{t.department}</td>
                                <td>
                                  <span className="badge bg-light text-dark border">{t.reason}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="col-12 col-xl-6">
          <SectionCard title="Fees & Finance" icon="bi-cash-stack">
            <div className="row g-3">
              <div className="col-12 col-lg-4">
                <div className="border rounded-4 p-3 h-100">
                  <div className="text-muted small">Total Fees Due</div>
                  <div className="fs-5 fw-bold mt-1">{formatINR(data.feesOverview.totalFeesDue)}</div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="border rounded-4 p-3 h-100">
                  <div className="text-muted small">Total Fees Paid</div>
                  <div className="fs-5 fw-bold mt-1">{formatINR(data.feesOverview.totalFeesPaid)}</div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="border rounded-4 p-3 h-100">
                  <div className="text-muted small">Today Collection</div>
                  <div className="fs-5 fw-bold mt-1">{formatINR(data.feesOverview.todayCollection)}</div>
                </div>
              </div>

              <div className="col-12">
                <div className="border rounded-4 p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="fw-bold">Top Defaulters</div>
                    <Link className="small text-decoration-none" to="/admin/fees/defaulters">
                      View All
                    </Link>
                  </div>

                  <div className="table-responsive mt-2">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr className="text-muted small">
                          <th>Name</th>
                          <th>Class</th>
                          <th>Due</th>
                          <th>Last Paid</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.feesOverview.topDefaulters.map((d, idx) => (
                          <tr key={idx}>
                            <td className="fw-semibold">{d.name}</td>
                            <td>
                              {d.class}-{d.section}
                            </td>
                            <td>
                              <span className="badge bg-warning text-dark">{formatINR(d.due)}</span>
                            </td>
                            <td>{d.lastPaid}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Strength + Grievances */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-xl-6">
          <SectionCard title="Class-wise Student Strength" icon="bi-people">
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={data.charts.classWiseStrength} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="classLabel" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <div className="col-12 col-xl-6">
          <SectionCard
            title="Grievances"
            icon="bi-exclamation-diamond"
            right={
              <Link to="/admin/grievances" className="btn btn-sm btn-outline-primary rounded-4">
                View All
              </Link>
            }
          >
            <div className="row g-3">
              <div className="col-12 col-lg-5">
                <div style={{ width: "100%", height: 240 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={data.charts.grievanceStatusDistribution}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        innerRadius={45}
                      >
                        {data.charts.grievanceStatusDistribution.map((_, idx) => (
                          <Cell key={idx} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="d-flex flex-column gap-2 mt-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Pending</span>
                    <b>{data.grievanceOverview.pending}</b>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Open</span>
                    <b>{data.grievanceOverview.open}</b>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Resolved</span>
                    <b>{data.grievanceOverview.resolved}</b>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-7">
                <div className="border rounded-4 p-3">
                  <div className="fw-bold">Latest Tickets</div>
                  <div className="table-responsive mt-2">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr className="text-muted small">
                          <th>Ticket</th>
                          <th>By</th>
                          <th>Priority</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.grievanceOverview.latest5.map((g) => (
                          <tr key={g.ticketId}>
                            <td>
                              <div className="fw-semibold">{g.ticketId}</div>
                              <div className="small text-muted">{g.name}</div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">{g.raisedBy}</span>
                            </td>
                            <td>
                              <span className={`badge ${badgeByPriority(g.priority)}`}>{g.priority}</span>
                            </td>
                            <td>
                              <span className={`badge ${badgeByStatus(g.status)}`}>{g.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Notices + Admissions + Workload */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-4">
          <SectionCard
            title="Notices"
            icon="bi-megaphone"
            right={
              <Link to="/admin/notices/create" className="btn btn-sm btn-primary rounded-4">
                <i className="bi bi-plus-lg me-2"></i>
                Create
              </Link>
            }
          >
            <div className="d-flex flex-column gap-2">
              {data.noticesOverview.latest5.map((n) => (
                <div key={n.id} className="border rounded-4 p-3">
                  <div className="d-flex align-items-start justify-content-between gap-2">
                    <div>
                      <div className="fw-semibold">{n.title}</div>
                      <div className="text-muted small">{n.createdAt}</div>
                    </div>
                    <span className={`badge ${noticeBadge(n.category)}`}>{n.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="col-12 col-xl-4">
          <SectionCard
            title="Admissions"
            icon="bi-person-vcard"
            right={
              <Link to="/admin/admissions" className="btn btn-sm btn-outline-primary rounded-4">
                View
              </Link>
            }
          >
            <div className="row g-2 mb-2">
              <div className="col-6">
                <div className="border rounded-4 p-3">
                  <div className="text-muted small">New</div>
                  <div className="fs-5 fw-bold">{data.admissionTracking.newRequests}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="border rounded-4 p-3">
                  <div className="text-muted small">Pending Docs</div>
                  <div className="fs-5 fw-bold">{data.admissionTracking.pendingDocumentVerification}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="border rounded-4 p-3">
                  <div className="text-muted small">Approved</div>
                  <div className="fs-5 fw-bold">{data.admissionTracking.approved}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="border rounded-4 p-3">
                  <div className="text-muted small">Rejected</div>
                  <div className="fs-5 fw-bold">{data.admissionTracking.rejected}</div>
                </div>
              </div>
            </div>

            <div className="border rounded-4 p-3">
              <div className="fw-bold">Latest Requests</div>
              <div className="table-responsive mt-2">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr className="text-muted small">
                      <th>App ID</th>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.admissionTracking.latestRequests.map((a) => (
                      <tr key={a.appId}>
                        <td className="fw-semibold">{a.appId}</td>
                        <td>{a.name}</td>
                        <td>
                          <span className="badge bg-light text-dark border">{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="col-12 col-xl-4">
          <SectionCard title="Teacher Workload" icon="bi-person-lines-fill">
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={data.charts.teacherWorkloadDistribution} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="teachers" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="border rounded-4 p-3 mt-3">
              <div className="fw-bold">Academic Summary</div>
              <div className="d-flex flex-column gap-2 mt-2">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Subjects Allocated</span>
                  <b>{data.timetableAcademicSummary.totalSubjectsAllocated}</b>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Unallocated Subjects</span>
                  <b>{data.timetableAcademicSummary.totalUnallocatedSubjects}</b>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Teachers w/o Timetable</span>
                  <b>{data.timetableAcademicSummary.teachersWithoutTimetable}</b>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Missing Timetable</span>
                  <b>{data.timetableAcademicSummary.classesWithMissingTimetable.length}</b>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Reports */}
      <div className="row g-3">
        <div className="col-12">
          <SectionCard title="Reports" icon="bi-bar-chart-line">
            <div className="row g-2">
              {data.reportsQuickLinks.map((r) => (
                <div className="col-12 col-sm-6 col-lg-4" key={r.title}>
                  <Link to={r.to} className="text-decoration-none">
                    <div className="border rounded-4 p-3 d-flex align-items-center gap-3">
                      <div className="rounded-4 bg-primary bg-opacity-10 p-2 d-flex align-items-center justify-content-center">
                        <i className={`bi ${r.icon} text-primary fs-4`}></i>
                      </div>
                      <div className="fw-semibold text-dark">{r.title}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Tiny CSS helper (optional) */}
      <style>{`
        .hover-shadow:hover{
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          transition: 0.2s ease;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;