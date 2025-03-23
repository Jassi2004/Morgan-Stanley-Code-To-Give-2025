import express from "express";
import { sendFeedback, getSentFeedbacks, getReceivedFeedbacks } from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/sendFeedback", sendFeedback);
router.get("/getSentFeedbacks/:studentId", getSentFeedbacks);
router.get("/getReceivedFeedbacks/:educatorId/:studentId", getReceivedFeedbacks);


export default router;
