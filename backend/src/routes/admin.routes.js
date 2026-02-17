import { Router } from "express";

import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { adminProfile } from "../controllers/adminProfile.controller.js";
import {
  createNotice,
  getAdminNotices,
  deleteNoticeByAdmin,
} from "../controllers/notice.controller.js";

import {
  getAllGrievanceByAdmin,
  replyToGrievanceByAdmin,
  updateGrievanceStatus,
} from "../controllers/grievancePanel.controller.js";

import {
  getAllStudentProfilesByAdmin,
  getCompleteStudentProfileByAdmin,
  getAllStudentsByAdmin,
  getStudentByIdByAdmin,
} from "../controllers/studentProfile.controller.js";

import {
  createSubjectByAdmin,
  getAllSubjectsByAdmin,
  deleteSubjectByAdmin,
  getAllClassesWithSubjectsByAdmin,
  allocateSubjectsToClassByAdmin,
} from "../controllers/subjectClass.controller.js";

import {
  getAllTeachersByAdmin,
  getTeacherByIdByAdmin,
} from "../controllers/teacherProfile.controller.js";

import {
  addBookByAdmin,
  getAllBooksAdmin,
  getCopiesOfBookAdmin,
  addMoreCopiesAdmin,
  issueCopyToStudentAdmin,
  deleteBookAdmin,
  getReturnRequestsAdmin,
  acceptReturnAdmin,
  rejectReturnAdmin,
} from "../controllers/libraryAdmin.controller.js";

import {
  allocateTeacherToSubject,
  getAllocatedTeachers,
  deleteTeacherSubjectAllocation,
  getAllTeachersTimeTable,
  getAllClassesSubjectTimeTable,
  getSubjectsByClass
} from "../controllers/subjectTeacher.controller.js";

const router = Router();
/*****************************************************************/
router.get(
  "/subject-by-class/:classId",
verifyJWT,
authorizeRoles("admin"),
getSubjectsByClass
);


router.get(
  "/all-teacher-time-table",
  verifyJWT,
  authorizeRoles("admin"),
  getAllTeachersTimeTable,
);
router.get(
  "/all-class-time-table",
  verifyJWT,
  authorizeRoles("admin"),
  getAllClassesSubjectTimeTable,
);
router.post(
  "/allocate-subject-teacher",
  verifyJWT,
  authorizeRoles("admin"),
  allocateTeacherToSubject,
);
router.get(
  "/allocatedclass/:classId",
  verifyJWT,
  authorizeRoles("admin"),
  getAllocatedTeachers,
);
router.delete(
  "/deletedClassSubject/:classId/:subjectId",
  verifyJWT,
  authorizeRoles("admin"),
  deleteTeacherSubjectAllocation,
);

/******************************************************************** */
router.get("/admin-profile", verifyJWT, adminProfile);

router.post(
  "/create-notice",
  verifyJWT,
  upload.fields([{ name: "attachement", maxCount: 1 }]),
  createNotice,
);

router.get("/get-notice", verifyJWT, getAdminNotices);

router.delete("/delete-notice/:id", verifyJWT, deleteNoticeByAdmin);

router.get("/get-all-grivence", verifyJWT, getAllGrievanceByAdmin);

router.post(
  "/grievances/:grievanceId/reply",
  verifyJWT,
  replyToGrievanceByAdmin,
);

router.patch(
  "/grievances/:grievanceId/status",
  verifyJWT,
  updateGrievanceStatus,
);

// SUBJECT MASTER
router.post("/subjects", createSubjectByAdmin);
router.get("/subjects", getAllSubjectsByAdmin);
router.delete("/subjects/:id", deleteSubjectByAdmin);

// CLASS SUBJECT ALLOCATION
router.get("/classes-subjects", getAllClassesWithSubjectsByAdmin);
router.put("/classes/:classId/subjects", allocateSubjectsToClassByAdmin);
// -------------------------------------//

router.get("/teachers", verifyJWT, getAllTeachersByAdmin);
router.get("/teachers/:id", verifyJWT, getTeacherByIdByAdmin);

router.get("/students", verifyJWT, getAllStudentsByAdmin);
router.get("/students/:id", verifyJWT, getStudentByIdByAdmin);

// -----------------------------------------------//

router.post("/addBook", verifyJWT, addBookByAdmin);
router.get("/seeAllBooks", verifyJWT, getAllBooksAdmin);
router.get("/book/:bookId/copies", verifyJWT, getCopiesOfBookAdmin);
router.post("/book/:bookId/copies", verifyJWT, addMoreCopiesAdmin);
router.put("/copy/:copyId/issue", verifyJWT, issueCopyToStudentAdmin);
router.delete("/book/:bookId", verifyJWT, deleteBookAdmin);

// // return requests
router.get("/return-requests", verifyJWT, getReturnRequestsAdmin);
router.put("/return-requests/:requestId/accept", verifyJWT, acceptReturnAdmin);
router.put("/return-requests/:requestId/reject", verifyJWT, rejectReturnAdmin);

export default router;
