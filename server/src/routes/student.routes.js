import express from "express";
import { registerStudent, loginStudent, logoutStudent, profilePage, changePassword } from "../controllers/student.controller.js";


const router = express.Router();

// Student Authentication Routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent);

// Student Profile Routes
router.post("/profile", profilePage);
router.put("/change-password", changePassword);

export default router;