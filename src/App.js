import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Opening from './customer/Pages/Opening/opening';
import Homepaget from './customer/Pages/HomePage/HomePaget';
import BestSellerPage from './customer/Pages/BestSellerPage';
import LoginPage from './customer/Pages/LoginPage';
import { CartProvider } from './customer/components/CartContent';
import "@fontsource/league-spartan";
import OnboardingScreen from './customer/Pages/Opening/onboardingScreen';
const App = () => {
  return (
    <CartProvider>
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Opening />} />
          <Route path="/skip1" element={<OnboardingScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Homepaget />} />
          <Route path="/best-sellers" element={<BestSellerPage />} />
          {/* Add redirect for unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
    </CartProvider>
  );
};

export default App;