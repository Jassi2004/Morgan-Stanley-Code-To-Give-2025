import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyEmployee, verifyStudent, verifyAdmin } from '../middlewares/auth.middleware.js';
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
router.route("/logout").get(verifyStudent, logoutStudent);
router.route("/profile").get(verifyStudent, profilePage);
router.route("/change-password").post(verifyStudent, changePassword);

// File upload routes with student authentication
router.route("/upload-avatar").post(
    verifyStudent,
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
router.route("/all").get(fetchAllStudents);

export default router;