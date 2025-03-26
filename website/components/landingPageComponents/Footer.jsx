import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#236638] text-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
        {/* Contact Information */}
        <div>
          <h4 className="text-2xl font-bold mb-6 border-b-2 border-[#ffc34f] pb-3">Contact Us</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-[#ffc34f]" />
              <span>
                Ishanya India Foundation, 
                Bangalore, Karnataka, India
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-6 h-6 text-[#ffc34f]" />
              <span>+91     73496 76668</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-[#ffc34f]" />
              <span>info@ishanyaindiafoundation.org</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-2xl font-bold mb-6 border-b-2 border-[#ffc34f] pb-3">Quick Links</h4>
          <ul className="space-y-3">
            <li className="hover:text-[#ffc34f] transition-colors">
              <a href="/">Home</a>
            </li>
            <li className="hover:text-[#ffc34f] transition-colors">
              <a href="/about">About Us</a>
            </li>
            <li className="hover:text-[#ffc34f] transition-colors">
              <a href="/programs">Our Programs</a>
            </li>
            <li className="hover:text-[#ffc34f] transition-colors">
              <a href="/volunteer">Get Involved</a>
            </li>
            <li className="hover:text-[#ffc34f] transition-colors">
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-2xl font-bold mb-6 border-b-2 border-[#ffc34f] pb-3">Stay Connected</h4>
          <p className="mb-4">
            Subscribe to our newsletter to stay updated on our initiatives and impact.
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full p-3 text-gray-700 rounded-l-lg focus:outline-none"
            />
            <button 
              className="bg-[#ffc34f] text-[#236638] px-6 py-3 rounded-r-lg hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-6">
            <a 
              href="#" 
              className="text-white hover:text-[#ffc34f] transition-colors"
              aria-label="Facebook"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className="text-white hover:text-[#ffc34f] transition-colors"
              aria-label="Instagram"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.148 3.229-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.148-4.771-1.694-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className="text-white hover:text-[#ffc34f] transition-colors"
              aria-label="LinkedIn"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.492 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.031c.546-.977 2-1.005 2 .894v4.075z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-12 pt-6 border-t border-[#ffc34f] text-center">
        <p>
          © {new Date().getFullYear()} Ishanya India Foundation. All Rights Reserved.
        </p>
        <p className="mt-2 text-sm">
          <a href="/privacy" className="hover:text-[#ffc34f] mr-4">Privacy Policy</a>
          <a href="/terms" className="hover:text-[#ffc34f]">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;