import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUserMd,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartBar,
  FaCalendarCheck,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaStethoscope
} from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Define sidebar items with their paths
  const menuItems = [
    { icon: <FaTachometerAlt />, label: 'Dashboard', path: '/' },
    { icon: <FaUserMd />, label: 'Doctors', path: '/doctors' },
    { icon: <FaUsers />, label: 'Clients', path: '/clients' },
    { icon: <FaStethoscope />, label: 'Services', path: '/services' },
    { icon: <FaCalendarCheck />, label: 'Appointments', path: '/appointments' },
    { icon: <FaFileInvoiceDollar />, label: 'Billing', path: '/billing' },
    { icon: <FaChartBar />, label: 'Reports', path: '/reports' },
  ];

  return (
    <div className={` bg-gray-900 text-gray-100 shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col`}>
      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Dashboard item with toggle */}
        <div className="flex items-center justify-between p-2 rounded cursor-pointer transition duration-200">
          <div className="flex items-center">
            {isOpen && <span></span>}
          </div>
          <button onClick={toggleSidebar} className="text-gray-100 text-md focus:outline-none">
            <FaBars />
          </button>
        </div>

        {menuItems.map(({ icon, label, path }) => (
          <SidebarNavItem key={label} icon={icon} label={label} path={path} isOpen={isOpen} />
        ))}
      </nav>

    </div>
  );
};

// SidebarNavItem uses NavLink to route on click and applies active styles
const SidebarNavItem = ({ icon, label, path, isOpen }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `flex items-center space-x-3 p-2 rounded cursor-pointer transition duration-200
      ${isActive ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-teal-600 hover:text-white'}`
    }
  >
    <span className="text-lg">{icon}</span>
    {isOpen && <span>{label}</span>}
  </NavLink>
);

export default Sidebar;
