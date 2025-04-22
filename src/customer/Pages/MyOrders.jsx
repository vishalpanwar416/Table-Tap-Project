import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Order Status Components with orange icons
const PendingOrders = () => (
  <div className="flex flex-col items-center justify-center py-10 px-4">
    <div className="w-20 h-20 md:w-24 md:h-24 mb-5 text-orange-500">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    </div>
    <h2 className="text-xl md:text-2xl font-medium text-center text-gray-300 max-w-xs">
      No orders waiting for acceptance
    </h2>
  </div>
);

const PreparingOrders = () => (
  <div className="flex flex-col items-center justify-center py-10 px-4">
    <div className="w-20 h-20 md:w-24 md:h-24 mb-5 text-orange-500">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v4M12 22v-4M4 12H2M6.314 6.314L4.9 4.9M17.686 6.314L19.1 4.9M6.314 17.69L4.9 19.1M17.686 17.69L19.1 19.1M20 12h2M12 6a6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6 6 6 0 0 1 6-6z"/>
      </svg>
    </div>
    <h2 className="text-xl md:text-2xl font-medium text-center text-gray-300 max-w-xs">
      No orders in preparation
    </h2>
  </div>
);

const CompletedOrders = () => (
  <div className="flex flex-col items-center justify-center py-10 px-4">
    <div className="w-20 h-20 md:w-24 md:h-24 mb-5 text-orange-500">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    </div>
    <h2 className="text-xl md:text-2xl font-medium text-center text-gray-300 max-w-xs">
      No completed orders yet
    </h2>
  </div>
);

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

  // Mock data for orders - replace with actual data fetching
  const orders = {
    pending: [],
    preparing: [],
    completed: []
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-black ">
      <div className="w-full max-w-[390px] md:max-w-4xl lg:max-w-6xl xl:max-w-7xl h-screen flex flex-col pt-5">
        {/* Header */}
        <div className="pt-4 md:pt-6 pb-2 relative">
          <button 
            className="absolute left-4 top-5 md:left-0 text-orange-500 hover:text-orange-600 transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={30} className="md:w-6 md:h-6" />
          </button>
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-white font-spartan-medium">
            My Orders
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl p-4 mt-5 md:p-6 flex-1 flex flex-col min-h-[calc(100vh-100px)] overflow-y-auto shadow-xl">
          {/* Centered Tabs */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="inline-flex gap-2 overflow-x-auto scrollbar-hide">
              <button 
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'pending' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                onClick={() => handleTabChange('pending')}
              >
                Order to be accepted
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'preparing' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                onClick={() => handleTabChange('preparing')}
              >
                Preparing
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'completed' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                onClick={() => handleTabChange('completed')}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Centered Content */}
          <div className="flex justify-center items-center flex-1">
            {orders[activeTab].length > 0 ? (
              <div className="w-full max-w-2xl">
                {/* Order Cards */}
                <div className="p-4 rounded-xl bg-gray-50 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">Sushi Platter</h3>
                      <p className="text-sm text-gray-500">Order #1234</p>
                    </div>
                    <span className="text-sm text-orange-500">₹499.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">2 items</span>
                    <span className="text-gray-500">15:30 PM</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full text-center">
                {activeTab === 'pending' && <PendingOrders />}
                {activeTab === 'preparing' && <PreparingOrders />}
                {activeTab === 'completed' && <CompletedOrders />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;