import express from 'express';
import { 
    registerStudent, 
    registerEmployee, 
    approveRegistration,
    rejectRegistration,
    getPendingNotifications
} from '../controllers/adminNotification.controller.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes for registration
router.post('/register/student', registerStudent);
router.post('/register/employee', registerEmployee);

// Protected admin routes

router.get('/pending',verifyAdmin, getPendingNotifications);
router.put('/approve/:notificationId', verifyAdmin,approveRegistration);
router.put('/reject/:notificationId', verifyAdmin ,rejectRegistration);

export default router; 