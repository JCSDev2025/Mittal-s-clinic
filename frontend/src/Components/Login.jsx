import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import BackgroundImg from "../assets/Log2.webp";

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
      className="min-h-screen flex items-center justify-start bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${BackgroundImg})` }}
    >
      <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-md ml-28 animate-fade-in">

        <h2 className="text-3xl font-bold text-blue-900 text-center mb-6 drop-shadow-md">Welcome Back</h2>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center bg-red-100 bg-opacity-70 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-10">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-blue-800 opacity-70" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-70 text-blue-900 placeholder-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-blue-800 opacity-70" />
            <input
              type="password"
              className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-70 text-blue-900 placeholder-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition duration-300 shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
