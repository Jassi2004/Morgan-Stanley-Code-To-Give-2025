
import { Router } from "express";
import { addEducator, approveStudentAccount, createEmployeeAccount, fetchAllEmployees, getEmployeeProfile, loginEmployeeAccount } from "../controllers/employee.controller.js";
import { verifyAdmin, verifyEmployee } from "../middlewares/auth.middleware.js";




const router = Router();


router.route("/create-account")
.post(createEmployeeAccount);

router.route("/login")
.post(loginEmployeeAccount);



// router.use(verifyJWT); 

router.route("/get-my-profile")
.get(getEmployeeProfile);


// Admin Routes

// router.use(verifyAdmin);

router.route("/add-educator")
.post(addEducator);

router.route("/fetch-all-employees")
.get(fetchAllEmployees);

router.route("/approve-student")
.post(approveStudentAccount);


export default router;