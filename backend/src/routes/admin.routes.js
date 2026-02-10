import { Router } from "express";

import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {adminProfile} from "../controllers/adminProfile.controller.js";
import {
  createNotice,
  getAdminNotices
} from "../controllers/notice.controller.js";


const router = Router();

router.get("/admin-profile",verifyJWT,adminProfile);

router.post(
  "/create-notice",
  verifyJWT,
  upload.fields([{ name: "attachement", maxCount: 1 }]),
  createNotice
);

router.get("/get-notice",verifyJWT,getAdminNotices);

export default router;
