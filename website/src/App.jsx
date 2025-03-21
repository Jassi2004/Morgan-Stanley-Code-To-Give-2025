import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import AddTeacherForm from "../components/form/AddTeacherForm";
import AddStudentForm from "../components/form/AddStudentForm";
import Team from "../pages/Team";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="/students/add" element={<AddStudentForm />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="/teachers/add" element={<AddTeacherForm />} />
          <Route path="/aboutTeam" element={<Team />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;