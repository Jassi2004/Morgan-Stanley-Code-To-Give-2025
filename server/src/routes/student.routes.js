import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyStudent, verifyAdmin, verifyEmployee } from '../middlewares/auth.middleware.js';
import {
    registerStudent,
    loginStudent,
    logoutStudent,
    profilePage,
    changePassword,
    fetchAllStudents,
    updateProfile,
    uploadProfilePicture
} from '../controllers/student.controller.js';

const router = Router();

// Public routes (no auth required)
router.route("/register").post(registerStudent);
router.route("/login").post(loginStudent);

// Protected routes (require student authentication)
router.route("/logout").get(logoutStudent);
router.route("/profile/:studentId")
  .get(profilePage);  // Admin access
router.route("/profile")
  .get(profilePage); // Student access to their own profile
router.route("/change-password").post(changePassword);

// File upload routes with student authentication
router.route("/upload-avatar").post(
    upload.single("avatar"),
    uploadProfilePicture
);

router.route("/update-profile").put(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "UDID", maxCount: 1 }
    ]),
    updateProfile
);

// Admin only routes
router.route("/fetchAllStudents").get(fetchAllStudents);

export default router;