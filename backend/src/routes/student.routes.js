import { Router } from "express";

import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createOrUpdateStudentProfile,
  getMyStudentProfile,
} from "../controllers/studentProfile.controller.js";

import {getStudentData} from "../controllers/studentDashboard.controller.js";
import {createApplyForm} from "../controllers/ApplyForm.controller.js";



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

router.get("/dashboard",verifyJWT,getStudentData);

router.post(
  "/apply-form",
  verifyJWT,
  upload.fields([{ name: "attachment", maxCount: 1 }]),
  createApplyForm
);


export default router;
