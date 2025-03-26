import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  HelpCircle
} from "lucide-react";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationLimit, setNotificationLimit] = useState(3);
   const [isEducator, setIsEducator] = useState(false);

   const studentExists = localStorage.getItem("studentId") ? true : false;
   console.log("StudentExists : ", studentExists);


  useEffect(() => {
    const educatorStatus = localStorage.getItem("educatorId") ? true : false;
    // console.log( localStorage.getItem("educatorId"))
    // console.log(educatorStatus);
    
    setIsEducator(educatorStatus);
  }, []);


  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleProfileClick = () => {
    setProfileOpen(false);
    if (location.pathname.includes('/employee')) {
      navigate('/employee/profile');
    } else {
      if(studentExists){
        navigate('/student/profile');
      }else{
        navigate('/admin/profile');
      }
    }
  };

  const { notifications } = useContext(AppContext);
  const notificationArray = notifications.notifications;

  // Click outside handler for notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsOpen]);

  // Click outside handler for profile menu
  useEffect(() => {
    const handleClickOutsideProfile = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutsideProfile);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProfile);
    };
  }, [profileOpen]);

  const handleLogOut = () => {
    localStorage.clear();
    window.location.href = "/"; // Redirect to home
  };
  

  return isEducator ? (
    <header className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)] py-4 px-6">
    <div className="flex items-center justify-between">
      <h1 className="text-[var(--color-text-primary)] text-lg font-bold">
        Educator Dashboard
      </h1>
      <div className="gap-10">

      <button
        onClick={() => navigate('/employee/profile')}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mx-10 hover:bg-blue-600"
        >
        Profile
      </button>
      <button onClick={handleLogOut} className="text-[var(--color-danger)]">
        Logout
      </button>
        </div>
    </div>
  </header>
) : !studentExists ?  (
  <header className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)] py-4 px-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* <button 
          onClick={toggleSidebar} 
          className="text-[var(--color-text-primary)] hover:text-[var(--color-brand)] focus:outline-none"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button> */}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] relative"
            >
              <Bell size={20} />
              {/* {notificationArray.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--color-danger)]"></span>
              )} */}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] z-10">
                <div className="p-4 border-b border-[var(--color-border-primary)]">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notificationArray.slice(0, notificationLimit).map(notification => (
                    <div key={notification.id} className="p-4 border-b border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)]">
                      <p className="text-sm text-[var(--color-text-primary)]">{notification.message}</p>
                      <p className="text-xs text-[var(--color-text-accent)] mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                {notificationLimit < notificationArray.length && (
                  <div className="p-2 text-center">
                    <button
                      onClick={() => setNotificationLimit(notificationLimit + 3)}
                      className="text-sm text-[var(--color-brand)] hover:underline"
                    >
                      View more
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        {/* Profile Menu */}
        <div className="relative">
        <button
        onClick={() => navigate('/admin/profile')}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Profile
      </button>
          <button
            onClick={handleLogOut}
            className="text-[var(--color-danger)] px-4 py-2 rounded-md hover:bg-[var(--color-bg-secondary)]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
  ) : (
    <header className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)] py-4 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[var(--color-text-primary)] text-lg font-bold">
          Student Dashboard
        </h1>
        <div className="gap-10 flex flex-row justify-center items-center ">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={handleLogOut} className="text-[var(--color-danger)]">
            Logout
          </button>
          </div>
      </div>
    </header>
  )
};

export default Header;
