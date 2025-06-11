import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu } from 'react-icons/fi'; // Using Feather Icons
import JCSGr from "../assets/JCS1.jpg"; // Assuming these paths are correct
import MittalLogo from "../assets/Logo.webp"; // Assuming these paths are correct

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
    setMobileMenuOpen(false); // Close mobile menu on logout
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentTagline((prev) => (prev + 1) % taglines.length);
        setFade(true);
      }, 300); // Duration for fade out
    }, 5000); // Show each tagline for 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 text-slate-200 shadow-xl border-b border-slate-700">
      {/* Top decorative strip */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600" /> {/* Thicker strip, new gradient */}

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8"> {/* Wider max-width on larger screens */}
        <div className="flex justify-between items-center py-4 relative"> {/* Increased vertical padding */}
          {/* Left section - Logo & Clinic Name */}
          <div className="flex items-center space-x-4 flex-shrink-0"> {/* Increased space-x */}
            <div className="bg-slate-800 p-0.5 rounded-full shadow-md flex items-center justify-center border-2 border-indigo-500"> {/* Added border */}
              <img
                src={MittalLogo}
                alt="Mittal Clinic Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover" // Slightly larger logos
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide text-indigo-400 truncate"> {/* Larger and bolder clinic name */}
                Mittal Clinic
              </h1>
              <p className="text-indigo-300 text-xs sm:text-sm hidden sm:block truncate opacity-80"> {/* Softer text */}
                Beauty & Wellness Center
              </p>
            </div>
          </div>

          {/* Center tagline - Desktop only */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-fit px-4 pointer-events-none"> {/* w-fit for content-based width */}
            <p
              className={`text-center text-base font-medium transition-opacity duration-700 bg-indigo-800 bg-opacity-40 text-indigo-200 px-6 py-2 rounded-full backdrop-blur-sm shadow-inner max-w-full ${ // Refined styling
                fade ? 'opacity-100' : 'opacity-0'
              }`}
              title={taglines[currentTagline]}
            >
              {taglines[currentTagline]}
            </p>
          </div>

          {/* Right section - Desktop */}
          <div className="hidden md:flex items-center space-x-6 flex-shrink-0"> {/* Increased space-x */}
            <button
              onClick={handleLogout}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-md text-sm font-semibold whitespace-nowrap group" // Enhanced button
              aria-label="Logout"
            >
              <FiLogOut className="mr-2 h-5 w-5 group-hover:rotate-6 transition-transform" /> {/* Icon animation on hover */}
              Logout
            </button>
            <div className="bg-slate-800 p-0.5 rounded-full shadow-md flex items-center justify-center border-2 border-indigo-500"> {/* Added border */}
              <img
                src={JCSGr}
                alt="JCS Group Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover" // Slightly larger logos
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-indigo-400 p-2 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <FiMenu className="h-7 w-7" /> {/* Larger mobile menu icon */}
            </button>
          </div>
        </div>

        {/* Mobile tagline - Always visible on mobile */}
        <div className="lg:hidden py-2 text-center px-4"> {/* Changed md:hidden to lg:hidden to show on tablets too */}
          <p
            className={`text-xs sm:text-sm font-medium transition-opacity duration-700 px-4 bg-indigo-800 bg-opacity-30 py-1.5 text-indigo-200 rounded-full backdrop-blur-sm truncate shadow-inner ${ // Refined styling
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
        <nav className="md:hidden bg-slate-800 border-t border-slate-700 pb-4"> {/* Increased pb */}
          <div className="px-4 pt-4 flex flex-col items-center space-y-4"> {/* Increased pt and space-y */}
            <button
              onClick={handleLogout}
              className="w-full max-w-xs flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-full transition-all duration-300 shadow-md text-base font-semibold whitespace-nowrap" // Larger button, consistent styling
              aria-label="Logout"
            >
              <FiLogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-slate-800 p-0.5 rounded-full shadow-md flex items-center justify-center border-2 border-indigo-500"> {/* Added border */}
                <img
                  src={JCSGr}
                  alt="JCS Group Logo"
                  className="w-14 h-14 rounded-full object-cover" // Larger logo in mobile menu
                />
              </div>
              <p className="text-indigo-400 text-sm font-semibold">JCS Group</p>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;