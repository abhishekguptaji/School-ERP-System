import {Router} from "express";

import {registerUser} from "../controllers/user.controller.js";
import {
  loginUser,
  logoutUser

} from "../controllers/login.controller.js";

import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();



router.route("/register").post(registerUser);
router.route("/login-user").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);

export default router;