
import { Router } from "express";
import { giveGradesToStudent } from "../controllers/grades.controller.js";


const router = Router();


router.route("/give-student")
.post(giveGradesToStudent);


export default router;
