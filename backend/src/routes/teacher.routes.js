import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getTeacherProfile,
  createOrUpdateTeacherProfile
} from "../controllers/teacherProfile.controller.js";

const router = Router();

router.get("/teacher-profile", verifyJWT, getTeacherProfile);
router.post(
  "/teacher-profile",
  verifyJWT,
  upload.fields([{ name: "teacherImage", maxCount: 1 }]),
  createOrUpdateTeacherProfile,
);

export default router;
