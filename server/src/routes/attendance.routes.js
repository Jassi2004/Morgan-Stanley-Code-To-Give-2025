import { fetchMonthlyStudentAttendanceReports, uploadAttendanceFromExcel } from "../controllers/attendance.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { Router } from "express";

const router = Router();



router.route("/upload-excel")
.post(upload.single("file"), uploadAttendanceFromExcel);

router.route("/fetch-monthly")
.post(fetchMonthlyStudentAttendanceReports);

export default router;

