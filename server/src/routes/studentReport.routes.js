import { Router } from "express";
import { fetchAllStudentReports, fetchStudentReportById, generateMonthlyReport, generateStudentQuarterlyReport } from "../controllers/studentReport.controller.js";

const router = Router();


router.route("/generate")
.post(generateStudentQuarterlyReport);


router.route("/generate-monthly")
.post(generateMonthlyReport);


router.route("/fetch")
.post(fetchStudentReportById);

router.route("/fetch-all")
.get(fetchAllStudentReports);



export default router;

