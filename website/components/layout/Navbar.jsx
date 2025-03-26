import React, { useState, useEffect } from 'react';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  const navItems = [
    { label: '', href: '#home' },
    // { label: 'About', href: '#about' },
    // { label: 'Our Work', href: '#work' },
    // { label: 'Gallery', href: '#gallery' },
    // { label: 'Contact', href: '#contact' }
  ];

  const loginOptions = [
    { label: 'Admin Login', href: '/login/admin' },
    { label: 'Employee Login', href: '/employee/login' },
    { label: 'Student Login', href: '/student/login' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsLoginDropdownOpen(false);
  };

  const toggleLoginDropdown = () => {
    setIsLoginDropdownOpen(!isLoginDropdownOpen);
    setIsMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.login-dropdown') && !event.target.closest('.login-button')) {
        setIsLoginDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed max-h-[60px] top-0 left-0 w-full bg-[#236638] text-white z-50 shadow-md">
      <div className="max-w-6xl mx-auto mt-[-20px] px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="https://bangaloreinternationalcentre.org/wp-content/uploads/Ishanya_logo-592x296.png" 
            alt="Ishanya India Foundation Logo" 
            className="h-20 w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className="hover:text-[#ffc34f] transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
          
          {/* Login Dropdown */}
          <div className="relative">
            <button
              onClick={toggleLoginDropdown}
              className="login-button flex items-center space-x-2 hover:text-[#ffc34f] transition-colors duration-300"
            >
              <User size={20} />
              <span>Login</span>
              <ChevronDown size={16} />
            </button>
            
            {isLoginDropdownOpen && (
              <div className="login-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {loginOptions.map((option) => (
                  <Link
                    key={option.label}
                    to={option.href}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsLoginDropdownOpen(false)}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Login Button for Mobile */}
          <button 
            onClick={toggleLoginDropdown}
            className="text-white focus:outline-none"
          >
            <User size={24} />
          </button>
          
          <button 
            onClick={toggleMenu} 
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#236638] absolute top-full left-0 w-full">
          <div className="flex flex-col items-center py-4 space-y-4">
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className="hover:text-[#ffc34f] transition-colors duration-300"
                onClick={toggleMenu}
              >
                {item.label}
              </a>
            ))}
            {/* Mobile Login Options */}
            {loginOptions.map((option) => (
              <Link
                key={option.label}
                to={option.href}
                className="hover:text-[#ffc34f] transition-colors duration-300"
                onClick={toggleMenu}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Login Dropdown */}
      {isLoginDropdownOpen && (
        <div className="md:hidden bg-[#236638] absolute top-full right-0 w-48">
          <div className="flex flex-col py-4">
            {loginOptions.map((option) => (
              <Link
                key={option.label}
                to={option.href}
                className="px-4 py-2 hover:text-[#ffc34f] transition-colors duration-300"
                onClick={() => setIsLoginDropdownOpen(false)}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;