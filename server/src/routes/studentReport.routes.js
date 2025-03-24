import { Router } from "express";
import { fetchStudentReportById, generateMonthlyReport, generateStudentQuarterlyReport } from "../controllers/studentReport.controller.js";

const router = Router();


router.route("/generate")
.post(generateStudentQuarterlyReport);


router.route("/generate-monthly")
.post(generateMonthlyReport);


router.route("/fetch")
.post(fetchStudentReportById);



export default router;

