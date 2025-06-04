import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JCSGr from "../assets/JCS1.jpg";
import MittalLogo from "../assets/Logo.webp";

const taglines = [
  "Welcome to Mittal Clinic — Transforming Wellness with Every Visit.",
  "Experience Expert Beauty Care Tailored Just for You.",
  "Because You Deserve to Feel Confident and Rejuvenated.",
  "We’re Committed to Your Glow, Inside and Out.",
  "Trusted Hands. Visible Results. Personal Attention.",
  "Your Journey to Wellness Starts with a Smile.",
];

const Header = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [currentTagline, setCurrentTagline] = useState(0);
  const [fade, setFade] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentTagline((prev) => (prev + 1) % taglines.length);
        setFade(true);
      }, 300); // wait for fade-out before switching
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow-lg px-6  flex justify-between items-center border-b border-gray-200 relative">
      {/* Left logo */}
      <div>
        <img
          src={MittalLogo}
          alt="Mittal Logo"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      {/* Center rotating tagline */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-center w-[70%]">
        <p
          className={`text-[1.05rem] text-indigo-700 font-medium transition-opacity duration-700 ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {taglines[currentTagline]}
        </p>
      </div>

      {/* Logout + right logo */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition duration-300 shadow text-sm font-medium"
        >
          Logout
        </button>
        <img
          src={JCSGr}
          alt="JCS Logo"
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>
    </header>
  );
};

export default Header;
