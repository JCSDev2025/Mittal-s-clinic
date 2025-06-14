import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu } from 'react-icons/fi'; // Using Feather Icons
import JCSGr from "../assets/JCS2.png"; // Assuming these paths are correct
import MittalLogo from "../assets/Logo.webp"; // Assuming these paths are correct

const Header = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/');
    setMobileMenuOpen(false); // Close mobile menu on logout
  };

  return (
    <header className="bg-white text-gray-800 shadow-lg border-b border-gray-200">
      {/* Top decorative strip - soft blue gradient */}
      <div className="h-1.5 bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400" />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 relative">
          {/* Left section - Logo & Clinic Name */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="bg-blue-50 p-0.5 rounded-full shadow-md flex items-center justify-center border-2 border-blue-300">
              <img
                src={MittalLogo}
                alt="Mittal Clinic Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide text-blue-700 truncate">
                Mittal's Hair Skin & Laser
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm hidden sm:block truncate opacity-80">
                Beauty & Wellness Center
              </p>
            </div>
          </div>

          {/* Right section - Desktop */}
          <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-md text-sm font-semibold whitespace-nowrap group"
              aria-label="Logout"
            >
              <FiLogOut className="mr-2 h-5 w-5 group-hover:rotate-6 transition-transform" />
              Logout
            </button>
            <div className="bg-blue-50 p-1.5 rounded-full shadow-md flex items-center justify-center border-2 border-blue-300">
              <img
                src={JCSGr}
                alt="JCS Group Logo"
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-blue-600 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <FiMenu className="h-7 w-7" />
            </button>
          </div>
        </div>

        {/* Mobile tagline - Removed */}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-gray-50 border-t border-gray-200 pb-4">
          <div className="px-4 pt-4 flex flex-col items-center space-y-4">
            <button
              onClick={handleLogout}
              className="w-full max-w-xs flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full transition-all duration-300 shadow-md text-base font-semibold whitespace-nowrap"
              aria-label="Logout"
            >
              <FiLogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-blue-50 p-0.5 rounded-full shadow-md flex items-center justify-center border-2 border-blue-300">
                <img
                  src={JCSGr}
                  alt="JCS Group Logo"
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
              <p className="text-blue-700 text-sm font-semibold">JCS Group</p>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;