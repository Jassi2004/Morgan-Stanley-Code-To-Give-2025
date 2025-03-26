import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    if (location.pathname.includes('/employee')) {
      navigate('/employee/profile');
    } else if (location.pathname.includes('/dashboard')) {
      navigate('/admin/profile');
    } else {
      navigate('/admin/profile');
    }
  };

  return (
    <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-[var(--color-text-primary)]">
                EduCare
              </span>
            </Link>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--color-bg-primary)] transition-colors duration-200"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-[var(--color-text-primary)]" />
              ) : (
                <Sun className="w-5 h-5 text-[var(--color-text-primary)]" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--color-bg-primary)] transition-colors duration-200 relative"
              >
                <Bell className="w-5 h-5 text-[var(--color-text-primary)]" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {/* Notifications Dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-[var(--color-bg-secondary)] rounded-lg shadow-lg border border-[var(--color-border-primary)] z-50">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          notification.read 
                            ? 'bg-[var(--color-bg-primary)]' 
                            : 'bg-[var(--color-brand)] bg-opacity-10'
                        }`}
                      >
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-bg-primary)] transition-colors duration-200"
              >
                <img 
                  src={user?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"}
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-[var(--color-text-primary)]">{user?.displayName || 'User'}</span>
              </button>
              {/* Profile Dropdown */}
              <div className={`absolute right-0 mt-2 w-48 bg-[var(--color-bg-secondary)] rounded-lg shadow-lg border border-[var(--color-border-primary)] z-50 ${isProfileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--color-bg-primary)] flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--color-bg-primary)] flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--color-bg-primary)] flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 