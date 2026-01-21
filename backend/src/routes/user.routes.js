import {Router} from "express";

import {registerUser} from "../controllers/user.controller.js";
import {loginUser} from "../controllers/login.controller.js";
const router = Router();



router.route("/register").post(registerUser);
router.route("/login-user").post(loginUser);



export default router;