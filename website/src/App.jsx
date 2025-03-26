import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import StudentRegister from "../pages/StudentRegister";
import StudentLogin from "../pages/StudentLogin";
// import AddTeacherForm from "../components/form/AddTeacherForm";
import AddStudentForm from "../components/form/AddStudentForm";
import Team from "../pages/Team";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import AddEducatorForm from "../components/form/AddEducatorForm";
// import EditStudent from "../components/student/EditStudent";
import StudentProfileView from "../components/student/StudentProfileView";
import StudentProfile from "../components/student/StudentProfile";
import AdminLogin from "../pages/AdminLogin";
import EmployeeRegister from "../pages/EmplooyeeRegister";
import EmployeeLogin from "../pages/EmployeeLogin";
import LandingPage2 from "../pages/LandingPage";
import EmployeeProfile from "../pages/EmployeeProfile"
import AdminProfile from "../pages/AdminProfile"
import ViewReport from "../pages/ViewReport"
import EditStudent from "../components/student/EditStudent";
import StudentDashboard from "../pages/StudentDashboard";
// import LandingPage3 from "../pages/LandingPage3";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - No Layout */}
        <Route path="/student/register" element={<StudentRegister/>}/>
        <Route path="/student/login" element={<StudentLogin/>}/>
        <Route path="/employee/register" element={<EmployeeRegister />} />
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/" element={<LandingPage2/>}/> 
        {/* <Route path="/landing3d" element={<LandingPage3/>}/>  */}
        
        {/* Dashboard Routes - With Layout */}
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Dashboard />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student/profile" element={<StudentDashboard/>}></Route>
          <Route path="/students" element={<Students />} />
          <Route path="/students/add" element={<AddStudentForm />} />
          <Route path="/students/:studentId" element={<StudentProfileView />} />
          <Route path="/students/:studentId/edit" element={<EditStudent />} />
          <Route path="/student/progress-report/:studentId" element={<ViewReport/>}></Route>
          <Route path="/reports/:studentId" element={<ViewReport />} />

          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/add" element={<AddEducatorForm />} />
          <Route path="/aboutTeam" element={<Team />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;