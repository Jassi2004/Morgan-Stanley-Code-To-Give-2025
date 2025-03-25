import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import StudentRegister from "../pages/StudentRegister";
import StudentLogin from "../pages/StudentLogin";
import AddTeacherForm from "../components/form/AddTeacherForm";
import AddStudentForm from "../components/form/AddStudentForm";
import Team from "../pages/Team";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import AddEducatorForm from "../components/form/AddEducatorForm";
import EditStudent from "../components/student/EditStudent";
import StudentProfile from "../components/student/StudentProfile";
import AdminLogin from "../pages/AdminLogin";
import EmployeeRegister from "../pages/EmplooyeeRegister";
import EmployeeLogin from "../pages/EmployeeLogin";
import LandingPage from "../pages/LandingPage"
import ChatBot from "../components/chatbotComponents/chatbottemp";
import LandingPage2 from "../pages/LandingPage2";
import LandingPage3 from "../pages/LandingPage3";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/student/register" element={<StudentRegister/>}/>
        <Route path="/student/login" element={<StudentLogin/>}/>
          <Route path="/employee/register" element={<EmployeeRegister />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/chatbot" element={<ChatBot />} />
          
        {/* <Route path="/landing" element={<LandingPage2/>}/> */}
        <Route path="/landing" element={<LandingPage2/>}/> 

        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="/students/add" element={<AddStudentForm />} />
          {/* <Route path="/students/edit" element={<EditStudent />} /> */}
          <Route path="students/:studentId" element={<StudentProfile />} />
          <Route path="students/:studentId/edit" element={<StudentProfile />} />

          <Route path="teachers" element={<Teachers />} />
          <Route path="/teachers/add" element={<AddEducatorForm />} />
          {/* <Route path="/teachers/add" element={<AddTeacherForm />} /> */}
          <Route path="/aboutTeam" element={<Team />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          {/* <Route path="/employee/profile" element={<EmployeeProfile />} /> */}
          {/* <Route path="/admin/profile" element={<AdminProfile />} /> */}
        </Route>
      </Routes>
    </Router>
    
  );
}

export default App;