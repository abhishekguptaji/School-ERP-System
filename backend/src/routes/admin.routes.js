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
  getCompleteStudentProfileByAdmin
} from "../controllers/studentProfile.controller.js";

const router = Router();

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

// --------------

router.get(
  "/students",
  verifyJWT,
  getAllStudentProfilesByAdmin
);

router.get(
  "/students/:studentProfileId/complete",
  verifyJWT,
  getCompleteStudentProfileByAdmin
);
export default router;
