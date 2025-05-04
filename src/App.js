import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Opening from '../src/Pages/shared/opening';
import Homepage from '../src/Pages/customer/HomePaget';
import BestSellerPage from '../src/Pages/customer/BestSellerPage';
import LoginPage from '../src/Pages/auth/LoginPage';
import { CartProvider } from '../src/components/customer/CartContent';
import "@fontsource/league-spartan";
import OnboardingScreen from '../src/Pages/shared/onboardingScreen';
import SignupPage from '../src/Pages/auth/SignupPage';
import { LikesProvider } from '../src/components/customer/LikesContent';
import LikedItemsPage from '../src/Pages/customer/LikedItemsPage';
import AdminPage from '../src/Pages/admin/AdminPage';
import MyOrders from '../src/Pages/customer/MyOrders';
import OrderConfirmation from '../src/Pages/customer/OrderConfirmation';
import PaymentPage from '../src/Pages/customer/PaymentPage';
import PrfilePage from '../src/Pages/customer/ProfilePage';
import AdminDashboard from '../src/Pages/admin/adminDashboard';
import CompleteProfile from '../src/Pages/auth/CompleteProfile';
import AuthWrapper from '../src/config/AuthWrapper';

const App = () => {
  return (
    <CartProvider>
      <LikesProvider>
        <Routes>
                <Route path="/" element={<Opening />} />
                <Route path="/skip1" element={<OnboardingScreen />} />
                <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/home" 
                  element={
                    <AuthWrapper>
                      <Homepage/>
                    </AuthWrapper>
                  } 
                />
                <Route path="/test" element={<div className="text-white">Test route working!</div>} />
                <Route path="/best-sellers" element={<BestSellerPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/liked-items" element={<LikedItemsPage />} />
                <Route 
                  path="/admin" 
                  element={
                    <AuthWrapper>
                      <AdminPage />
                    </AuthWrapper>
                  } 
                />
                <Route 
                  path="/admindashboard" 
                  element={
                    <AuthWrapper>
                      <AdminDashboard />
                    </AuthWrapper>
                  }
                />
                <Route path="/profile" element={<PrfilePage />} />
                <Route path="/Myorder" element={<MyOrders/>}/>
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
          </LikesProvider>
        </CartProvider>
      );
};

export default App;