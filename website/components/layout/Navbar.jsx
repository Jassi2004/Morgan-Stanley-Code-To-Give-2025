import React, { useState, useEffect } from 'react';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Our Work', href: '#work' },
    { label: 'Impact', href: '#impact' },
    { label: 'Contact', href: '#contact' }
  ];

  const loginOptions = [
    { label: 'Admin Login', href: '/login/admin' },
    { label: 'Employee Login', href: '/employee/login' },
    { label: 'Student Login', href: '/student/login' }
  ];

  const socialLinks = [
    { icon: <FaFacebook size={20} />, href: 'https://facebook.com/ishanya' },
    { icon: <FaTwitter size={20} />, href: 'https://twitter.com/ishanya' },
    { icon: <FaInstagram size={20} />, href: 'https://instagram.com/ishanya' },
    { icon: <FaLinkedin size={20} />, href: 'https://linkedin.com/company/ishanya' }
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
    <nav className="fixed max-h-[80px] top-0 left-0 w-full bg-[#3B8A4E] text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-12 py-8 flex justify-between items-center">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-12">
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className="text-lg hover:text-[#ffc34f] transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right side items */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffc34f] transition-colors duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
          
          {/* Login Dropdown */}
          <div className="relative">
            <button
              onClick={toggleLoginDropdown}
              className="login-button flex items-center space-x-2 text-lg hover:text-[#ffc34f] transition-colors duration-300"
            >
              <User size={24} />
              <span>Login</span>
              <ChevronDown size={20} />
            </button>
            
            {isLoginDropdownOpen && (
              <div className="login-dropdown absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                {loginOptions.map((option) => (
                  <Link
                    key={option.label}
                    to={option.href}
                    className="block px-6 py-3 text-gray-800 hover:bg-gray-100 transition-colors duration-200 text-base"
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
        <div className="md:hidden flex items-center space-x-6">
          {/* Social Links for Mobile */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffc34f] transition-colors duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
          
          {/* Login Button for Mobile */}
          <button 
            onClick={toggleLoginDropdown}
            className="text-white focus:outline-none"
          >
            <User size={28} />
          </button>
          
          <button 
            onClick={toggleMenu} 
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#222328] absolute top-full left-0 w-full">
          <div className="flex flex-col items-center py-6 space-y-6">
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className="text-lg hover:text-[#ffc34f] transition-colors duration-300"
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
                className="text-lg hover:text-[#ffc34f] transition-colors duration-300"
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
        <div className="md:hidden bg-[#222328] absolute top-full right-0 w-56">
          <div className="flex flex-col py-4">
            {loginOptions.map((option) => (
              <Link
                key={option.label}
                to={option.href}
                className="px-6 py-3 text-lg hover:text-[#ffc34f] transition-colors duration-300"
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