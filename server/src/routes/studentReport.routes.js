import { Router } from "express";
import { generateStudentReport } from "../controllers/studentReport.controller.js";

const router = Router();


router.route("/generate")
.post(generateStudentReport);



export default router;

