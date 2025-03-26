import { fetchMonthlyStudentAttendanceReports, getAttendanceByStudentId, uploadAttendanceFromExcel } from "../controllers/attendance.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { Router } from "express";

const router = Router();



router.route("/upload-excel")
.post(upload.single("file"), uploadAttendanceFromExcel);

router.route("/fetch-monthly")
.post(fetchMonthlyStudentAttendanceReports);

router.route("/get/:studentId")
.get(getAttendanceByStudentId);

export default router;

