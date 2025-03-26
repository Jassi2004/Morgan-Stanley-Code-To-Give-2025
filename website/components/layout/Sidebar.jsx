import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  HelpCircle,
  ChevronLeft
} from "lucide-react";
import { TbReportAnalytics } from "react-icons/tb";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { darkMode } = useContext(AppContext);
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isEducator, setIsEducator] = useState(false);
  const [transitionStage, setTransitionStage] = useState('idle');

  const studentExists = localStorage.getItem("studentId") ? true : false;
  const studentId = JSON.parse(localStorage.getItem("studentData"))?.student?.StudentId;
  // console.log("StudentId : ", studentId);
  

  useEffect(() => {
    const educatorStatus = localStorage.getItem("educatorId") ? true : false;
    // console.log( localStorage.getItem("educatorId"))
    // console.log(educatorStatus);
    
    setIsEducator(educatorStatus);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      if (isHovered !== isOpen) {
        setTransitionStage(isHovered ? 'expanding' : 'collapsing');
        const timeout = setTimeout(() => {
          setIsOpen(isHovered);
          setTimeout(() => setTransitionStage('idle'), 500);
        }, 50);
        return () => clearTimeout(timeout);
      }
    }
  }, [isHovered, isOpen, setIsOpen]);

  const navigationItems = isEducator
    ? [
        { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/employee/dashboard" },
        { title: "Students", icon: <GraduationCap size={20} />, path: "/students" },
      ]
      : !studentExists ? 
      [
        { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
        { title: "Teachers", icon: <Users size={20} />, path: "/teachers" },
        { title: "Students", icon: <GraduationCap size={20} />, path: "/students" },
        { title: "Meet The Developers", icon: <HelpCircle size={20} />, path: "/aboutTeam" },
      ] :
      [
        { title: "My Profile", icon: <LayoutDashboard size={20} />, path: "/student/profile" },
        { title: "My Attendance", icon: <Users size={20} />, path: `/student/my-attendance/${studentId}` },
        { title: "My Progress Report", icon: <TbReportAnalytics size={20} />, path: "/student/progress-report/:studentId" },
      ];

  return (
    <aside 
      className={`
        ${isOpen ? "w-64" : "w-20"}
        h-screen bg-[var(--color-bg-primary)] border-r border-[var(--color-border-primary)]
        transition-all duration-500 fixed md:relative z-20 overflow-hidden
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-[73px] px-4 border-b border-[var(--color-border-primary)]">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              SH
            </div>
            <h1 className={`ml-3 font-bold text-lg text-[var(--color-text-primary)] transition-all duration-500 ${isOpen ? "opacity-100" : "opacity-0 absolute"}`}>
              Ishanya
            </h1>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/");
              return (
                <li key={index}>
                  <Link to={item.path === "/student/progress-report/:studentId" ? `/student/progress-report/${studentId}` : item.path} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-300 ${isActive ? "bg-[var(--color-brand)] text-white" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"} ${isOpen ? "justify-start" : "justify-center"}`}>
                    <span>{item.icon}</span>
                    <span className={`ml-3 whitespace-nowrap transition-all duration-500 ${isOpen ? "opacity-100" : "opacity-0 absolute"}`}>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;