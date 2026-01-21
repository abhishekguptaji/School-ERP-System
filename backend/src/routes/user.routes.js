import { Router } from "express";

import { registerUser } from "../controllers/user.controller.js";
import { loginUser, logoutUser } from "../controllers/login.controller.js";

import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", loginUser);

router.post("/logout", verifyJWT, logoutUser);

router.post("/register", verifyJWT, authorizeRoles("admin"), registerUser);

export default router;
