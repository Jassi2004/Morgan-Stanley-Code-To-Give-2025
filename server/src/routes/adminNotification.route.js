import express from 'express';
import { registerStudent, registerEmployee, approveRegistration } from '../controllers/adminNotificationController.js';

const router = express.Router();


router.post('/register/student', registerStudent);


router.post('/register/employee', registerEmployee);


router.put('/approve/:notificationId', approveRegistration);

export default router;