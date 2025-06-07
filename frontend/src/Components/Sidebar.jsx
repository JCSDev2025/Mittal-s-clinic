import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUserMd,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartBar,
  FaCalendarCheck,
  FaBars,
  FaStethoscope,
  FaUserTie // new icon for Staff
} from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: <FaTachometerAlt />, label: 'Dashboard', path: '/' },
    { icon: <FaUserMd />, label: 'Doctors', path: '/doctors' },
    { icon: <FaUsers />, label: 'Clients', path: '/clients' },
    { icon: <FaStethoscope />, label: 'Services', path: '/services' },
    { icon: <FaUserTie />, label: 'Staff', path: '/staff' }, // ✅ Added Staff as regular item
    { icon: <FaCalendarCheck />, label: 'Appointments', path: '/appointments' },
    { icon: <FaFileInvoiceDollar />, label: 'Billing', path: '/billing' },
    { icon: <FaChartBar />, label: 'Reports', path: '/reports' },
  ];

  return (
    <div
      className={`bg-gray-900 text-gray-200 shadow-lg transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } flex flex-col border-r border-gray-800`}
    >
      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Toggle Button */}
        <div className="flex items-center justify-end p-2">
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white transition-all duration-300 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* Sidebar Items */}
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
      `flex items-center space-x-3 px-4 py-2 rounded-md transition-all duration-200 font-medium ${
        isActive
          ? 'bg-blue-700 text-white shadow'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    {isOpen && <span>{label}</span>}
  </NavLink>
);

export default Sidebar;
