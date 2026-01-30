import { Router } from "express";

import { registerUser } from "../controllers/user.controller.js";
import { loginUser, logoutUser } from "../controllers/login.controller.js";

import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// router.route("/register").post(
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1,
//     },
//     {
//       name: "coverImage",
//       maxCount: 1,
//     },
//   ]),
//   registerUser
// );

router.post("/login", loginUser);



// <------ Secure routes --->
router.post("/logout", verifyJWT, logoutUser);
router.post("/register", verifyJWT, authorizeRoles("admin"), registerUser);


export default router;
