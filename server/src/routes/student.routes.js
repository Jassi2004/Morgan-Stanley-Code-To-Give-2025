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

router.get("/fetchAllStudents", fetchAllStudents);
export default router;


>>>>>>> 6923a61316f07f4ce77f8a427feaaadc43e1d457
