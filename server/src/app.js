import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(cors({
    origin :[process.env.FRONTEND_URL],
    credentials : true
}))


app.use(express.json({ limit : "10mb" }));
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());
app.use(express.static("public"));


// Import routes
import employeeRouter from "./routes/employee.routes.js";
import studentRouter from "./routes/student.routes.js";
import notificationRouter from "./routes/notification.routes.js"


app.use("/api/v1/employee", employeeRouter); 
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/notification", notificationRouter);



export { app };