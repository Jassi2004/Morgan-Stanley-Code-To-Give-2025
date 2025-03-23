import express from 'express';
import {
    registerStudent,
    registerEmployee,
    approveRegistration,
    rejectRegistration,
    getPendingNotifications,
    getEntityDetails, // Import the new controller for fetching entity details
} from '../controllers/adminNotification.controller.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js'; // Import middleware to verify admin privileges

const router = express.Router();

// Middleware to verify admin for all routes
// router.use(verifyAdmin);

// Public routes for registration
/**
 * Route: POST /register/student
 * Description: Register a new student notification
 * Access: Public
 */
router.post('/register/student', registerStudent);

/**
 * Route: POST /register/employee
 * Description: Register a new employee notification
 * Access: Public
 */
router.post('/register/employee', registerEmployee);

// Protected admin routes
/**
 * Route: GET /pending
 * Description: Get all pending admin notifications
 * Access: Admin Only
 */
router.get('/pending', getPendingNotifications);

/**
 * Route: PUT /approve/:notificationId
 * Description: Approve a specific registration request
 * Access: Admin Only
 */
router.put('/approve/:notificationId', approveRegistration);

/**
 * Route: PUT /reject/:notificationId
 * Description: Reject a specific registration request and send a rejection email
 * Access: Admin Only
 */
router.put('/reject/:notificationId', rejectRegistration);

/**
 * Route: GET /details
 * Description: Fetch detailed information of a student or employee based on ID and type
 * Access: Admin Only
 */
router.get('/details', getEntityDetails);

export default router;