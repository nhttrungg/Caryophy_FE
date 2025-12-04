import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBook,
  FiRadio,
  FiList,
  FiMusic,
  FiUser,
  FiDisc,
  FiHelpCircle,
  FiX,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';

export default function ClientSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { to: '/home', label: 'Trang chủ', icon: FiHome },
    {to: '/client/profile', label: 'Hồ sơ', icon: FiUser},
    {to: '/client/settings',label: 'Cài đặt',icon: FiSettings},
    {to: '/login',label: 'Đăng xuất',icon: FiLogOut}
  ];

  const renderNavItem = (item) => {
    const Icon = item.icon;
    return (
      <Link
        key={item.to}
        to={item.to}
        className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
          path === item.to ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
        }`}
        onClick={onClose}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span className="text-sm font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        ></div>
      )}
      <div className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex justify-between items-center p-4">
          <button onClick={onClose}>
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map(renderNavItem)}
        </nav>
        <Link
          to="/client/help"
          className="flex items-center py-2 px-4 rounded-md m-2 bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors duration-200"
          onClick={onClose}
        >
          <FiHelpCircle className="h-5 w-5 mr-3" />
          <span className="text-sm font-medium">Trợ giúp</span>
        </Link>
      </div>
    </>
  );
}
