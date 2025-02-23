import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const mainNavItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/dsa', label: 'DSA Tracker' },
    { path: '/system-design', label: 'System Design' },
    { path: '/devops', label: 'DevOps' },
    { path: '/projects', label: 'Projects' },
    { path: '/resources', label: 'Resources' },
    { path: '/community', label: 'Community' }
  ];

  const settingsItems = [
    { path: '/settings', label: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5" /> },
    {
      label: isDarkMode ? 'Light Mode' : 'Dark Mode',
      icon: isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />,
      onClick: toggleTheme
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg transition-colors duration-200 relative z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0" onClick={closeMenu}>
              <span className={`text-xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-200`}>
                Bodhi Track
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {/* Main Navigation Items */}
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-indigo-600 text-white'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-indigo-50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Divider */}
            <div className={`h-6 w-px mx-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

            {/* Settings and Theme Toggle */}
            {settingsItems.map((item, index) => (
              item.path ? (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-indigo-600 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-indigo-50'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`p-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-indigo-50'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </button>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } md:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        ></div>

        {/* Menu panel */}
        <div
          className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } relative w-64 h-full overflow-y-auto shadow-xl transition-transform transform`}
        >
          <div className="pt-5 pb-6 px-4 space-y-6">
            {/* Main Navigation Items */}
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-indigo-600 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-indigo-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className={`h-px w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

            {/* Settings and Theme Toggle */}
            <div className="space-y-1">
              {settingsItems.map((item, index) => (
                item.path ? (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-indigo-600 text-white'
                        : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-indigo-50'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick();
                      closeMenu();
                    }}
                    className={`w-full px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200 ${
                      isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-indigo-50'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
