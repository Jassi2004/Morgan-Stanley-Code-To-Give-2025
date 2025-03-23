import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(cors());


app.use(express.json({ limit : "10mb" }));
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());
app.use(express.static("public"));


// Import routes
import employeeRouter from "./routes/employee.routes.js";
import studentRouter from "./routes/student.routes.js";
import notificationRouter from "./routes/notification.routes.js"
import feedbackRouter from "./routes/feedback.routes.js"
import adminNotificationRouter from "./routes/adminNotification.route.js"

app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/feedback", feedbackRouter);
app.use("/api/v1/admin-notification", adminNotificationRouter); 


export { app };