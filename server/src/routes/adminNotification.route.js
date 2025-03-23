import express from 'express';
import {
    registerStudent,
    registerEmployee,
    approveRegistration,
    rejectRegistration,
    getPendingNotifications,
} from '../controllers/adminNotification.controller.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes for registration
router.post('/register/student', registerStudent);
router.post('/register/employee', registerEmployee);

// Protected admin routes
router.get('/pending', getPendingNotifications);
router.put('/approve/:notificationId', approveRegistration);
router.put('/reject/:notificationId', rejectRegistration);

export default router;