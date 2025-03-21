
import { Router } from "express";
import { addEducator, createEmployeeAccount, fetchAllEmployees, getEmployeeProfile, loginEmployeeAccount } from "../controllers/employee.controller.js";
import { verifyAdmin, verifyEmployee } from "../middlewares/auth.middleware.js";




const router = Router();


router.route("/create-account")
.post(createEmployeeAccount);

router.route("/login")
.post(loginEmployeeAccount);



<<<<<<< HEAD
// router.use(verifyJWT); 
=======
router.use(verifyEmployee); 
>>>>>>> 47999e6eab6be4dbc4737f8e517b4b51a9bcffe9

router.route("/get-my-profile")
.get(getEmployeeProfile);


// Admin Routes

// router.use(verifyAdmin);

router.route("/add-educator")
.post(addEducator);

router.route("/fetch-all-employees")
.get(fetchAllEmployees);


export default router;