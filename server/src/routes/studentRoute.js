import express from "express";
import { registerStudent, loginStudent, logoutStudent } from "../controllers/studentController.js";
import { getStudentProfile, updateStudentPassword } from "../controllers/profileController.js";

const router = express.Router();

// Student Authentication Routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent);

// Student Profile Routes
router.get("/profile", getStudentProfile);
router.put("/change-password", updateStudentPassword);

export default router;
