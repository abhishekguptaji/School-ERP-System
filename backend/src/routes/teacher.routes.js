import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  getTeacherProfile,
  createOrUpdateTeacherProfile,
} from "../controllers/teacherProfile.controller.js";

import { getTeacherNotice } from "../controllers/notice.controller.js";

import { passwordChangeTeacher } from "../controllers/passwordChange.controller.js";

import { getTeacherProfileShort } from "../controllers/teacherDashboard.controller.js";

import {
  teacherGetPendingLeaves,
  teacherActionOnLeave,
} from "../controllers/studentleave.controller.js";

import { getMyTimeTableTeacher } from "../controllers/timetable.controller.js";

import { 
  getMyAllocations,
  uploadStudyMaterial,
  getMyStudyMaterials,
  deleteStudyMaterial
} from "../controllers/studyMaterial.controller.js";

const router = Router();

router.get("/get-allocated-classSubject", verifyJWT, getMyAllocations);
router.post(
  "/add-study-material",
  verifyJWT,
  upload.single("file"),  
  uploadStudyMaterial
);
router.get("/see-study-material",verifyJWT,getMyStudyMaterials);
router.delete("/delete-study-material/:id",verifyJWT,deleteStudyMaterial);

router.get("/teacher-time-table", verifyJWT, getMyTimeTableTeacher);

router.get("/studentleave/pending", verifyJWT, teacherGetPendingLeaves);
router.patch("/studentleave/action/:leaveId", verifyJWT, teacherActionOnLeave);

router.post("/password-change", verifyJWT, passwordChangeTeacher);

router.get("/teacher-profile", verifyJWT, getTeacherProfile);
router.post(
  "/teacher-profile",
  verifyJWT,
  upload.fields([{ name: "teacherImage", maxCount: 1 }]),
  createOrUpdateTeacherProfile,
);

router.get("/get-notice", verifyJWT, getTeacherNotice);

router.get("/teacher-dashboard", verifyJWT, getTeacherProfileShort);

export default router;
