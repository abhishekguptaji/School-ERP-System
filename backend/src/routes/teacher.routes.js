import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  getTeacherProfile,
  createOrUpdateTeacherProfile,
} from "../controllers/teacherProfile.controller.js";

import { 
  getTeacherNotice 
} from "../controllers/notice.controller.js";

import { 
  passwordChangeTeacher 
} from "../controllers/passwordChange.controller.js";

const router = Router();

router.post("/password-change", verifyJWT, passwordChangeTeacher);

router.get("/teacher-profile", verifyJWT, getTeacherProfile);
router.post(
  "/teacher-profile",
  verifyJWT,
  upload.fields([{ name: "teacherImage", maxCount: 1 }]),
  createOrUpdateTeacherProfile,
);

router.get("/get-notice", verifyJWT, getTeacherNotice);

export default router;
