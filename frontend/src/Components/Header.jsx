import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import JCSGr from "../assets/JCS1.jpg";
import MittalLogo from "../assets/Logo.webp";

const taglines = [
  "Welcome to Mittal Clinic — Transforming Wellness with Every Visit.",
  "Experience Expert Beauty Care Tailored Just for You.",
  "Because You Deserve to Feel Confident and Rejuvenated.",
  "We're Committed to Your Glow, Inside and Out.",
  "Trusted Hands. Visible Results. Personal Attention.",
  "Your Journey to Wellness Starts with a Smile.",
];

const Header = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [currentTagline, setCurrentTagline] = useState(0);
  const [fade, setFade] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/');
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentTagline((prev) => (prev + 1) % taglines.length);
        setFade(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gray-900 text-gray-200 shadow-md border-b border-gray-800">
      {/* Top decorative strip */}
      <div className="h-1 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700" />

      <div className="max-w-full mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3 relative">
          {/* Left section - Logo & Clinic Name */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="bg-gray-800 rounded-full shadow-md flex items-center justify-center">
              <img
                src={MittalLogo}
                alt="Mittal Clinic Logo"
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-blue-400 truncate">
                Mittal Clinic
              </h1>
              <p className="text-blue-300 text-xs sm:text-sm hidden sm:block truncate">
                Beauty & Wellness Center
              </p>
            </div>
          </div>

          {/* Center tagline - Desktop only */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-2/3 justify-center px-4">
            <p
              className={`text-center text-sm font-medium transition-opacity duration-700 bg-blue-800 bg-opacity-40 text-blue-300 px-4 py-2 rounded-full backdrop-blur-sm max-w-full truncate ${
                fade ? 'opacity-100' : 'opacity-0'
              }`}
              title={taglines[currentTagline]}
            >
              {taglines[currentTagline]}
            </p>
          </div>

          {/* Right section - Desktop */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-all duration-300 shadow text-sm font-medium backdrop-blur-sm whitespace-nowrap"
              aria-label="Logout"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
            <div className="bg-gray-800 p-1 rounded-full shadow-md flex items-center justify-center">
              <img
                src={JCSGr}
                alt="JCS Group Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-900"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-blue-400 p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile tagline - Always visible on mobile */}
        <div className="md:hidden py-2 text-center px-4">
          <p
            className={`text-xs font-medium transition-opacity duration-700 px-4 bg-blue-800 bg-opacity-30 py-1 text-blue-300 rounded-full backdrop-blur-sm truncate ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
            title={taglines[currentTagline]}
          >
            {taglines[currentTagline]}
          </p>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 pt-2 pb-4 flex flex-col items-center space-y-4">
            <button
              onClick={handleLogout}
              className="w-full max-w-xs flex items-center justify-center bg-blue-700 hover:bg-blue-600 text-white px-4 py-3 rounded-full transition-all duration-300 shadow text-sm font-medium backdrop-blur-sm whitespace-nowrap"
              aria-label="Logout"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-gray-800 p-1 rounded-full shadow-md flex items-center justify-center">
                <img
                  src={JCSGr}
                  alt="JCS Group Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-900"
                />
              </div>
              <p className="text-blue-400 text-sm font-semibold">JCS Group</p>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
