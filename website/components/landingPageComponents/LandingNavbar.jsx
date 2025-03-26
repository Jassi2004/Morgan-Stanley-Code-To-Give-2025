import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <img 
            src="https://bangaloreinternationalcentre.org/wp-content/uploads/Ishanya_logo-592x296.png" 
            alt="Ishanya Logo" 
            className="h-12 hover:scale-105 transition-transform"
          />
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Programs</a>
            <a href="#" className="nav-link">Contact</a>
            
            {/* Join Us Dropdown */}
            <div className="relative group">
              <button 
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition-all hover:shadow-lg group-hover:shadow-yellow-200/50"
                onClick={() => setIsOpen(!isOpen)}
              >
                Join Us
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transition-all duration-300 transform ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}>
                <a 
                  href="/student/login" 
                  className="dropdown-link"
                >
                  Student Login
                </a>
                <a 
                  href="/employee/login" 
                  className="dropdown-link"
                >
                  Employee Login
                </a>
                <a 
                  href="/admin/login" 
                  className="dropdown-link"
                >
                  Admin Login
                </a>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}