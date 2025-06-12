import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import BackgroundImg from "../assets/Log2.webp";
import Logo from "../assets/Logo.webp";
import CornerLogo from "../assets/JCS2.png"; // <- Add your second logo here

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'Admin' && password === '123456789') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 relative"
      style={{ backgroundImage: `url(${BackgroundImg})` }}
    >
      {/* Top-left corner logo */}
      <img
        src={CornerLogo}
        alt="Top Left Logo"
        className="absolute top-4 left-4 w-16 h-16 sm:w-20 sm:h-20 object-contain z-10"
      />

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-xl bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl px-6 sm:px-10 py-8 sm:py-12 animate-fade-in transition-all duration-500 text-center">
        
        {/* Center logo */}
        <div className="flex justify-center mb-6">
          <img
            src={Logo}
            alt="Main Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full shadow-lg"
          />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6 tracking-wide drop-shadow-sm">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-100 border border-red-300 bg-opacity-80 px-4 py-2 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8">
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-800 text-lg" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/80 placeholder-blue-700 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-800 text-lg" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/80 placeholder-blue-700 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
