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
  getOurGrievanceByStudent,
} from "../controllers/grievancePanel.controller.js";

import {
  getMyIssuedCopiesStudent,
  requestReturnStudent,
} from "../controllers/libraryAdmin.controller.js";

import {getStudentNotice} from "../controllers/notice.controller.js";

import {
  studentGetMyInvoices,
} from "../controllers/feeInvoice.controller.js";

import {
  studentGetMyReceipts,
} from "../controllers/feePayment.controller.js";

import {
  applyStudentLeave,
  getMyStudentLeaves
} from "../controllers/studentleave.controller.js";

const router = Router();

router.post(
  "/leave-appiled/myself",
  verifyJWT,
  upload.fields([
    {
      name: "attachment",
      maxcount: 1,
    },
  ]),
  applyStudentLeave,
);
router.get("/leave-appiled/myself", verifyJWT, getMyStudentLeaves);


router.get("/invoice", verifyJWT, studentGetMyInvoices); 
router.get("/receipts/:studentId", verifyJWT, studentGetMyReceipts);/**------------ */

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

router.get("/apply-grievance",verifyJWT,getOurGrievanceByStudent);

router.get("/get-notice",verifyJWT,getStudentNotice);


router.get("/my-issued", verifyJWT, getMyIssuedCopiesStudent);


router.post("/copy/:copyId/return-request", verifyJWT, requestReturnStudent);


export default router;
