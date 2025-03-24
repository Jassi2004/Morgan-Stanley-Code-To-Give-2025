import { Router } from "express";
import { generateMonthlyReport, generateStudentQuarterlyReport } from "../controllers/studentReport.controller.js";

const router = Router();


router.route("/generate")
.post(generateStudentQuarterlyReport);


router.route("/generate-monthly")
.post(generateMonthlyReport);


export default router;

