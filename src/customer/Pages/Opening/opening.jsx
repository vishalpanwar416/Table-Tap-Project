import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo1 from '../../../customer/Photos/logott.png';

const MotionFrame = ({ children }) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    transition={{ type: "spring", stiffness: 100, damping: 20 }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

export default function Opening() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentScreen === 'splash') {
        setCurrentScreen('login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [currentScreen]);

  const handleSkip = () => navigate('/skip1');
  const handleLogin = () => navigate('/login');

  return (
    <div className="w-full h-screen flex justify-center items-center font-spartan overflow-hidden">
      <AnimatePresence mode='wait'>
        {currentScreen === 'splash' ? (
          <MotionFrame key="splash">
            <SplashScreen />
          </MotionFrame>
        ) : (
          <MotionFrame key="login">
            <LoginScreen handleSkip={handleSkip} handleLogin={handleLogin} />
          </MotionFrame>
        )}
      </AnimatePresence>
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-cyan-100 md:bg-gradient-to-b md:from-cyan-100 md:to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center p-8"
      >
        <img src={logo1} alt="Logo" className="w-[300px] md:w-[400px]" />
      </motion.div>
    </div>
  );
}

function LoginScreen({ handleSkip, handleLogin }) {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-cyan-200 opacity-90 md:bg-gradient-to-r 
    md:from-cyan-100 md:to-white gap-6 pt-[80%] md:pt-[250px] pb-[150px] md:pb-[100px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center px-4"
      >
        <img src={logo1} alt="Logo" className="w-[250px] md:w-[400px]" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-8 w-full max-w-xs flex flex-col gap-4 pb-6 font-spartan-medium px-4 "
      >
        <button 
          className="py-3 bg-white border-2 border-gray-800 text-gray-800 rounded-full shadow-sm
                     hover:bg-gray-50 transition-colors"
          onClick={handleLogin}
        >
          Log In
        </button>
        <button className="py-3 bg-white text-gray-800 border-2 border-gray-800 rounded-full shadow-sm
                          hover:bg-gray-50 transition-colors">
          Sign Up
        </button>
        <button 
          onClick={handleSkip}
          className="mt-4 text-center text-gray-500 text-xl pt-10 hover:text-gray-700 cursor-pointer
                     transition-colors font-spartan-medium"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}