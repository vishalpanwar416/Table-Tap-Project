import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar, profileImg, menuOptions, userName, userEmail, onLogout }) => {
  const slideVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          <motion.div
            key="sidebar-content"
            className="fixed top-1 right-0 h-full w-full bg-black z-50 rounded-l-[80px]"
            style={{ maxWidth: '70%' }}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="pt-16 pb-6 px-6 flex flex-col items-center border-b border-gray-800">
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-purple-500">
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold text-white">{userName}</h2>
              <p className="text-gray-400 text-sm mt-1">{userEmail}</p>
            </div>

            <div className="py-4">
              {menuOptions.map((option, index) => (
                <div key={index}>
                  <button className="w-full py-3 px-6 flex items-center text-left hover:bg-gray-800 transition-colors duration-200 group">
                    <div className="bg-gray-700 rounded-full p-3 mr-4 group-hover:bg-purple-500 transition-colors">
                      {React.cloneElement(option.icon, { className: "w-5 h-5 text-gray-300 group-hover:text-white" })}
                    </div>
                    <span className="text-lg text-gray-300 group-hover:text-white">{option.name}</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 mb-6">
              <button className="w-full py-5 px-20 flex items-center text-left hover:bg-gray-800 transition-colors duration-200 group"
                onClick={() => {
                  toggleSidebar();
                  onLogout();
                }}
              >
                <div className="bg-gray-700 rounded-full p-3 mr-4 group-hover:bg-red-500 transition-colors">
                  <LogOut className="w-5 h-5 text-gray-300 group-hover:text-white" />
                </div>
                <span className="text-lg text-gray-300 group-hover:text-white">Log Out</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            key="sidebar-overlay"
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={toggleSidebar}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;