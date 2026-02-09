import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createOrUpdateStudentProfile,
  getMyStudentProfile,
} from "../controllers/studentProfile.controller.js";

import { getStudentData } from "../controllers/studentDashboard.controller.js";
import {
  createApplyForm,
  getMyApplyForms,
} from "../controllers/ApplyForm.controller.js";

import {
  createGrievance,
  getOurGrievance
} from "../controllers/grievancePanel.controller.js";


const router = Router();

router.get("/student-profile", verifyJWT, getMyStudentProfile);

router.post(
  "/student-profile",
  verifyJWT,
  upload.fields([
    { name: "userImage", maxCount: 1 },
    { name: "fatherImage", maxCount: 1 },
    { name: "motherImage", maxCount: 1 },
  ]),
  createOrUpdateStudentProfile,
);

router.get("/dashboard", verifyJWT, getStudentData);

router.post(
  "/apply-form",
  verifyJWT,
  upload.fields([{ name: "attachment", maxCount: 1 }]),
  createApplyForm,
);

router.get("/apply-form", verifyJWT, getMyApplyForms);

router.post(
  "/apply-grievance",
  verifyJWT,
  upload.fields([{ name: "attachment", maxCount: 1 }]),
  createGrievance
);

router.get("/apply-grievance",verifyJWT,getOurGrievance);



export default router;
