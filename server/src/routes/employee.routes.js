
import { Router } from "express";
import { addEducator, approveStudentAccount, createEmployeeAccount, deleteEmployeeAccount, fetchAllEmployees, getEmployeeProfile, loginEmployeeAccount, logoutEmployee, uploadProfilePicture } from "../controllers/employee.controller.js";
import { verifyAdmin, verifyEmployee } from "../middlewares/auth.middleware.js";
import  { upload } from "../middlewares/multer.middleware.js";



const router = Router();


router.route("/create-account")
.post(createEmployeeAccount);

router.route("/login")
.post(loginEmployeeAccount);




// router.use(verifyEmployee); 

router.route("/get-my-profile")
.get(getEmployeeProfile);



router.route("/upload-avatar")
.post(upload.single("avatar"), uploadProfilePicture);


router.route("/logout")
.get(logoutEmployee);






// Admin Routes

// router.use(verifyAdmin);

router.route("/add-educator")
.post(addEducator);

router.route("/fetch-all-employees")
.get(fetchAllEmployees);

router.route("/approve-student")
.post(approveStudentAccount);

router.route("/delete-employee")
.delete(deleteEmployeeAccount);


export default router;