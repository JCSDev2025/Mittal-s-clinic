import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiMenu,        // Still using Feather icon for the toggle button
} from 'react-icons/fi';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: <div className="text-2xl">📊</div>, label: 'Dashboard', path: '/' }, // Changed to emoji
    { icon: <div className="text-2xl">👩‍⚕️</div>, label: 'Doctors', path: '/doctors' }, // Changed to emoji
    { icon: <div className="text-2xl">👥</div>, label: 'Clients', path: '/clients' }, // Changed to emoji
    { icon: <div className="text-2xl">💎</div>, label: 'Services', path: '/services' }, // Changed to emoji
    { icon: <div className="text-2xl">👔</div>, label: 'Staff', path: '/staff' }, // Changed to emoji
    { icon: <div className="text-2xl">🗓️</div>, label: 'Appointments', path: '/appointments' }, // Changed to emoji
    { icon: <div className="text-2xl">💰</div>, label: 'Billing', path: '/billing' }, // Changed to emoji
    { icon: <div className="text-2xl">📈</div>, label: 'Reports', path: '/reports' }, // Changed to emoji
  ];

  return (
    <div
      className={`bg-white text-gray-700 shadow-xl transition-all duration-300 relative z-40 flex flex-col min-h-screen ${
        isOpen ? 'w-64' : 'w-20'
      } border-r border-gray-200`}
    >
      {/* Toggle Button */}
      <div className={`flex ${isOpen ? 'justify-end pr-5' : 'justify-center'} items-center pt-5 pb-4 h-16`}>
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          aria-label="Toggle Sidebar"
        >
          <FiMenu size={isOpen ? 26 : 22} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map(({ icon, label, path }) => (
          <SidebarNavItem key={label} icon={icon} label={label} path={path} isOpen={isOpen} />
        ))}
      </nav>
    </div>
  );
};

const SidebarNavItem = ({ icon, label, path, isOpen }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `flex items-center rounded-lg transition-all duration-200 font-medium whitespace-nowrap overflow-hidden
      ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg' // Active state: vibrant blue background, white text
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700' // Inactive state: gray text, light blue background on hover
      }
      ${
        isOpen
          ? 'px-4 py-3 space-x-4'
          : 'justify-center py-3' // Consistent padding and centering for closed state
      }`}
    title={label}
  >
    <span className={`flex-shrink-0 ${isOpen ? 'text-xl' : 'text-2xl'}`}>
      {icon}
    </span>
    {isOpen && <span className="flex-grow text-sm">{label}</span>}
  </NavLink>
);

export default Sidebar;
