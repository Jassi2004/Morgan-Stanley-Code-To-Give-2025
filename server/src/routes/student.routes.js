import express from "express";
import { registerStudent, loginStudent, logoutStudent, profilePage, changePassword, fetchAllStudents,updateProfile, uploadProfilePicture } from "../controllers/student.controller.js";
import  { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Student Authentication Routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent);

// Student Profile Routes
router.post("/profile", profilePage);
router.put("/change-password", changePassword);
router.get("/fetchAllStudents", fetchAllStudents);
router.put("/update-profile", updateProfile);

router.post("/uploadAvatar", upload.single("avatar"), uploadProfilePicture);

export default router;
