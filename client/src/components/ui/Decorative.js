import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const BackgroundGradient = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: isDarkMode
            ? `radial-gradient(circle at 50% 50%, 
                rgba(79, 70, 229, 0.1) 0%, 
                transparent 50%),
              radial-gradient(circle at 0% 0%, 
                rgba(147, 51, 234, 0.1) 0%, 
                transparent 50%),
              radial-gradient(circle at 100% 100%, 
                rgba(59, 130, 246, 0.1) 0%, 
                transparent 50%)`
            : `radial-gradient(circle at 50% 50%, 
                rgba(79, 70, 229, 0.05) 0%, 
                transparent 50%),
              radial-gradient(circle at 0% 0%, 
                rgba(147, 51, 234, 0.05) 0%, 
                transparent 50%),
              radial-gradient(circle at 100% 100%, 
                rgba(59, 130, 246, 0.05) 0%, 
                transparent 50%)`
        }}
      />
    </div>
  );
};

export const GridPattern = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(${isDarkMode ? '#fff' : '#000'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDarkMode ? '#fff' : '#000'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export const FloatingShapes = () => {
  const { isDarkMode } = useTheme();
  
  const shapes = [
    { x: '10%', y: '20%', delay: 0 },
    { x: '90%', y: '30%', delay: 1 },
    { x: '50%', y: '80%', delay: 2 },
    { x: '20%', y: '90%', delay: 3 },
    { x: '80%', y: '10%', delay: 4 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute w-16 h-16 ${
            isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.02]'
          }`}
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: ['0%', '20%', '0%'],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <svg viewBox="0 0 100 100" fill={isDarkMode ? '#fff' : '#000'}>
            {index % 3 === 0 && (
              <circle cx="50" cy="50" r="40" />
            )}
            {index % 3 === 1 && (
              <rect x="10" y="10" width="80" height="80" />
            )}
            {index % 3 === 2 && (
              <polygon points="50,10 90,90 10,90" />
            )}
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export const Sparkles = ({ children }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <span className="relative inline-block">
      <motion.span
        className="absolute inset-0"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <svg
          className={`absolute w-full h-full ${
            isDarkMode ? 'text-indigo-500' : 'text-indigo-600'
          }`}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
        >
          <path d="M50 10L55 40L85 50L55 60L50 90L45 60L15 50L45 40L50 10Z" />
        </svg>
      </motion.span>
      {children}
    </span>
  );
};

export const GlowingBorder = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="relative group">
      <div
        className={`absolute -inset-0.5 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 
          ${isDarkMode ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600' : 
                        'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}`}
      />
      <div className={`relative rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } p-4`}>
        {children}
      </div>
    </div>
  );
};

export const WavePattern = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,90.7C960,85,1056,139,1152,154.7C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill={isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(249, 250, 251, 0.8)'}
          animate={{
            d: [
              "M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,90.7C960,85,1056,139,1152,154.7C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,122.7C672,128,768,192,864,213.3C960,235,1056,213,1152,181.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "linear",
            repeatType: "reverse"
          }}
        />
      </svg>
    </div>
  );
};
