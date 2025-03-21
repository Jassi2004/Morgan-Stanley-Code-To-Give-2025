import { registerStudent, loginStudent, logoutStudent } from "../controllers/studentController.js";

const router = express.Router();

// Route for student registration
router.post("/register", registerStudent);

// Route for student login
router.post("/login", loginStudent);

// Route for student logout
router.post("/logout", logoutStudent);

export default router;