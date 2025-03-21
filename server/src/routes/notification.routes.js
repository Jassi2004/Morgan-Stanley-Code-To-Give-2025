import express from "express";
import {getNotification, sendNotification} from "../controllers/notification.controller.js"

const router = express.Router();

router.get("/getnotification", getNotification);
router.post("/sendnotification", sendNotification);

export default router;

