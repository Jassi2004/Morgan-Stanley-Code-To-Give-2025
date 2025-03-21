import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
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
  const { darkMode, setDarkMode } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const notifications = [
    { id: 1, message: "New student registration pending approval", time: "10 minutes ago" },
    { id: 2, message: "Teacher Sarah submitted monthly report", time: "2 hours ago" },
    { id: 3, message: "Upcoming training session tomorrow", time: "1 day ago" }
  ];

  return (
    <header className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)] py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="text-[var(--color-text-primary)] hover:text-[var(--color-brand)] focus:outline-none"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search students, teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 py-2 pl-10 pr-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
            <Search className="absolute left-3 top-2.5 text-[var(--color-text-accent)]" size={18} />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--color-danger)]"></span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] z-10">
                <div className="p-4 border-b border-[var(--color-border-primary)]">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="p-4 border-b border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)]">
                      <p className="text-sm text-[var(--color-text-primary)]">{notification.message}</p>
                      <p className="text-xs text-[var(--color-text-accent)] mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center">
                  <button className="text-sm text-[var(--color-brand)] hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white">
                <span className="font-medium">AM</span>
              </div>
              <span className="hidden md:block text-[var(--color-text-primary)]">Admin</span>
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] z-10">
                <div className="p-4 border-b border-[var(--color-border-primary)]">
                  <p className="font-medium text-[var(--color-text-primary)]">Admin Manager</p>
                  <p className="text-sm text-[var(--color-text-accent)]">admin@spectrumsupport.org</p>
                </div>
                <div className="py-2">
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]">
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]">
                    <HelpCircle size={16} />
                    <span>Help</span>
                  </button>
                  <div className="border-t border-[var(--color-border-primary)] mt-2 pt-2">
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-[var(--color-danger)] hover:bg-[var(--color-bg-secondary)]">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;