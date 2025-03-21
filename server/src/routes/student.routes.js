import express from "express";
import { registerStudent, loginStudent, logoutStudent, profilePage, changePassword, fetchAllStudents } from "../controllers/student.controller.js";


const router = express.Router();

// Student Authentication Routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent);

// Student Profile Routes
router.post("/profile", profilePage);
router.put("/change-password", changePassword);
<<<<<<< HEAD
router.get("/fetchAllStudents", fetchAllStudents);
export default router;
=======

export default router;
>>>>>>> b350d9003e724fc02dd577e2428244a382457000
