import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Our Work', href: '#work' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#236638] text-white z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="https://bangaloreinternationalcentre.org/wp-content/uploads/Ishanya_logo-592x296.png" 
            alt="Ishanya India Foundation Logo" 
            className="h-10 w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className="hover:text-[#ffc34f] transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;