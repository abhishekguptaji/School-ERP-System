import { Router } from "express";

import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {adminProfile} from "../controllers/adminProfile.controller.js";

const router = Router();

router.get("/admin-profile",verifyJWT,adminProfile);


export default router;
