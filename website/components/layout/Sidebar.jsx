import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { 
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Calendar,
  Mail,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BarChart,
  FileCheck,
  Bell
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { darkMode } = useContext(AppContext);
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [transitionStage, setTransitionStage] = useState('idle');

  // Enhanced hover and animation handling
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      if (isHovered !== isOpen) {
        // Set pre-transition stage
        setTransitionStage(isHovered ? 'expanding' : 'collapsing');
        
        // Apply transition with a slight delay
        const timeout = setTimeout(() => {
          setIsOpen(isHovered);
          // Allow time for transition to complete before setting idle
          setTimeout(() => setTransitionStage('idle'), 500);
        }, 50);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [isHovered, isOpen, setIsOpen]);

  const navigationItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { title: "Teachers", icon: <Users size={20} />, path: "/teachers" },
    { title: "Students", icon: <GraduationCap size={20} />, path: "/students" },
    
    { title: "Analytics", icon: <BarChart size={20} />, path: "/analytics", separator: true },
    { title: "Reports", icon: <FileText size={20} />, path: "/reports" },
    { title: "Assessments", icon: <FileCheck size={20} />, path: "/assessments" },
    
    { title: "Schedule", icon: <Calendar size={20} />, path: "/schedule", separator: true },
    { title: "Messages", icon: <Mail size={20} />, path: "/messages", badge: 5 },
    { title: "Notifications", icon: <Bell size={20} />, path: "/notifications" },
    
    { title: "Settings", icon: <Settings size={20} />, path: "/settings", separator: true },
    { title: "Meet The Developers", icon: <HelpCircle size={20} />, path: "/aboutTeam" },
  ];

  return (
    <aside 
      className={`
        group
        ${isOpen ? "w-64" : "w-20"}
        h-screen
        bg-[var(--color-bg-primary)]
        border-r border-[var(--color-border-primary)]
        transition-all duration-500 ease-in-out
        fixed md:relative z-20
        overflow-hidden
        will-change-auto
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between h-[74.5px] px-4 border-b border-[var(--color-border-primary)] transition-all duration-500">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              SH
            </div>
            <h1 
              className={`
                ml-3 font-bold text-lg text-[var(--color-text-primary)]
                transition-all duration-500 ease-out
                ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 absolute"}
                overflow-hidden
              `}
              style={{ maxWidth: isOpen ? '200px' : '0' }}
            >
              Spectrum Hope
            </h1>
          </div>
          <button 
            onClick={() => {
              const isMobile = window.innerWidth < 768;
              if (isMobile) {
                setIsOpen(!isOpen);
              }
            }}
            className={`
              p-1 rounded-md text-[var(--color-text-secondary)] 
              hover:text-[var(--color-text-primary)] 
              hover:bg-[var(--color-bg-secondary)] 
              md:flex hidden
              transition-all duration-300
              ${isOpen ? "rotate-0" : "rotate-180"}
            `}
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.path || 
                              (item.path === "/dashboard" && location.pathname === "/");
              
              return (
                <li key={index}>
                  {item.separator && <div className="my-3 border-t border-[var(--color-border-primary)]"></div>}
                  <Link
                    to={item.path}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-in-out
                      ${isActive 
                        ? "bg-[var(--color-brand)] text-white" 
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                      }
                      ${isOpen ? "justify-start" : "justify-center md:justify-start"}
                      relative
                    `}
                  >
                    <span className={`flex-shrink-0 transition-transform duration-300 ${!isOpen ? "transform scale-110" : ""}`}>{item.icon}</span>
                    <span 
                      className={`
                        ml-3 whitespace-nowrap
                        transition-all duration-500 ease-out
                        absolute left-10 md:static
                        ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 md:hidden"}
                      `}
                      style={{ maxWidth: isOpen ? '200px' : '0' }}
                    >
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className={`
                        ml-auto
                        bg-[var(--color-danger)] text-white text-xs font-medium px-2 py-0.5 rounded-full
                        transition-all duration-500 ease-out
                        ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0 absolute"}
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Admin Info */}
        <div className={`
          p-4 border-t border-[var(--color-border-primary)] 
          transition-all duration-500 ease-out
          overflow-hidden
          ${isOpen ? "opacity-100 max-h-20" : "opacity-0 max-h-0 py-0"}
        `}>
          <div className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full bg-[var(--color-brand)] 
              flex items-center justify-center text-white
              transition-all duration-300
              ${isOpen ? "opacity-100" : "opacity-0"}
            `}>
              <span className="font-medium">AM</span>
            </div>
            <div className={`
              ml-3 
              transition-all duration-500 ease-out
              ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}
            `}>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Admin Manager</p>
              <p className="text-xs text-[var(--color-text-accent)]">View Profile</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;