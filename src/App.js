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
import SignupPage from './customer/Pages/SignupPage';
import { LikesProvider } from './customer/components/LikesContent';
import LikedItemsPage from './customer/Pages/LikedItemsPage';
import AdminPage from './customer/Pages/AdminPage';
const App = () => {
  return (
    <CartProvider>
    <LikesProvider>
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Opening />} />
          <Route path="/skip1" element={<OnboardingScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Homepaget />} />
          <Route path="/best-sellers" element={<BestSellerPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/liked-items" element={<LikedItemsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Add redirect for unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
    </LikesProvider>
    </CartProvider>
  );
};

export default App;