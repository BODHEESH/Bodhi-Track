import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CodeBracketIcon,
  ServerIcon,
  CommandLineIcon,
  FolderIcon,
  CalendarIcon,
  BookOpenIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'DSA', href: '/dsa', icon: CodeBracketIcon },
    { name: 'System Design', href: '/system-design', icon: ServerIcon },
    { name: 'DevOps', href: '/devops', icon: CommandLineIcon },
    // { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'Planning', href: '/planning', icon: CalendarIcon },
    { name: 'Resources', href: '/resources', icon: BookOpenIcon },
    { name: 'Community', href: '/community', icon: UserGroupIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-lg shadow-lg ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center justify-center h-16 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
            <span className="text-xl font-bold text-indigo-600">Bodhi Track</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-indigo-600' : isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle Button */}
          <div className="px-4 py-2 border-t border-b border-gray-200">
            <button
              onClick={toggleTheme}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? (
                <>
                  <SunIcon className="w-5 h-5 mr-3" />
                  Light Mode
                </>
              ) : (
                <>
                  <MoonIcon className="w-5 h-5 mr-3" />
                  Dark Mode
                </>
              )}
            </button>
          </div>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ArrowRightOnRectangleIcon className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 transition-padding duration-300">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
