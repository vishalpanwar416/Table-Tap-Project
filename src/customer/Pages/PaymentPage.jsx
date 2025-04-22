import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../customer/components/CartContent';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  // Calculate total with 5% GST
  const totalAmount = cartItems.reduce((sum, item) => {
    let price = item.price;
    if (item.discountType === 'percentage') {
      price = price * (1 - item.discountValue / 100);
    } else if (item.discountType === 'fixed') {
      price = price - item.discountValue;
    }
    return sum + price * item.quantity;
  }, 0) * 1.05;

  // Load Razorpay SDK
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleRazorpay = () => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: Math.round(totalAmount * 100), // paise
      currency: 'INR',
      name: 'Table Tap',
      description: 'Order Payment',
      image: '/logo.png',
      handler: function(response) {
        alert(`Payment Success: ${response.razorpay_payment_id}`);
        clearCart();
        navigate('/order-success');
      },
      prefill: {
        name: '', // fill dynamically if available
        email: '',
        contact: ''
      },
      notes: {},
      theme: { color: '#F37254' },
      method: { upi: true }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full md:w-3/5 lg:w-2/5 bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Complete Your Payment</h2>

        <div className="flex flex-col space-y-6">
          {/* Razorpay UPI Button */}
          <button
            onClick={handleRazorpay}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl shadow-md flex items-center justify-center transition-colors"
          >
            Pay ₹{totalAmount.toFixed(2)} via UPI
          </button>

          {/* OR Divider */}
          <div className="flex items-center text-gray-400">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* QR Code Section */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
            <div className="inline-block border-2 border-orange-500 rounded-lg p-4 shadow-sm">
              <img
                src="/upi-qr.png"
                alt="UPI QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>
            <p className="text-gray-600 mt-2 text-sm">
              Use any UPI app to scan and pay ₹{totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
