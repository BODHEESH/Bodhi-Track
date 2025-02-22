import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();

  // Apply theme-specific styles to the root element
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-transition-duration', '0.3s');
    root.style.setProperty('--theme-transition-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
    
    // Theme-specific custom properties
    if (isDarkMode) {
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--highlight-color', 'rgba(255, 255, 255, 0.1)');
    } else {
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--highlight-color', 'rgba(255, 255, 255, 0.7)');
    }
  }, [isDarkMode]);

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ease-in-out ${
        isDarkMode ? 'dark bg-gray-900' : 'light bg-gray-50'
      }`}
      style={{
        backgroundImage: isDarkMode 
          ? 'radial-gradient(circle at 50% 50%, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0.8))'
          : 'radial-gradient(circle at 50% 50%, rgba(249, 250, 251, 1), rgba(249, 250, 251, 0.8))'
      }}
    >
      <div className="transition-opacity duration-300">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={isDarkMode ? 'dark' : 'light'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-8"
          >
            <div className="relative">
              {/* Theme-specific decorative elements */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isDarkMode
                    ? 'radial-gradient(circle at 100% 0%, rgba(79, 70, 229, 0.1) 0%, transparent 50%)'
                    : 'radial-gradient(circle at 100% 0%, rgba(79, 70, 229, 0.05) 0%, transparent 50%)'
                }}
              />
              {children}
            </div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Layout;
