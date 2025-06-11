import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiMenu,         // Still using Feather icon for the toggle button
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
      className={`bg-slate-900 text-slate-300 shadow-xl transition-all duration-300 relative z-40 flex flex-col min-h-screen ${
        isOpen ? 'w-64' : 'w-20'
      } border-r border-slate-800`}
    >
      {/* Toggle Button */}
      <div className={`flex ${isOpen ? 'justify-end pr-5' : 'justify-center'} items-center pt-5 pb-4 h-16`}>
        <button
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
          aria-label="Toggle Sidebar"
        >
          <FiMenu size={isOpen ? 26 : 22} /> {/* Still using Feather icon for menu toggle */}
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
          ? 'bg-indigo-700 text-white shadow-lg'
          : 'text-slate-300 hover:bg-slate-700 hover:text-indigo-300'
      }
      ${
        isOpen
          ? 'px-4 py-3 space-x-4'
          : 'justify-center py-3' // Consistent padding and centering for closed state
      }`
    }
    title={label}
  >
    {/* The emoji icon is now rendered directly within the span */}
    <span className={`flex-shrink-0 ${isOpen ? 'text-xl' : 'text-2xl'}`}> {/* Adjusted text size for emojis */}
      {icon}
    </span>
    {isOpen && <span className="flex-grow text-sm">{label}</span>}
  </NavLink>
);

export default Sidebar;