import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../components/customer/CartContent';
import { supabase } from '../../supabase';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const tableNumber = location.state?.tableNumber;
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);


  // Calculate total with 5% GST
  const subtotal = cartItems.reduce((sum, item) => {
    let price = item.price;
    if (item.discountType === 'percentage') {
      price = price * (1 - item.discountValue / 100);
    } else if (item.discountType === 'fixed') {
      price = price - item.discountValue;
    }
    return sum + price * item.quantity;
  }, 0);
  
  const gst = subtotal * 0.05;
  const totalAmount = subtotal + gst;

  // Load Razorpay SDK with proper error handling
  useEffect(() => {
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      if (!window.Razorpay) {
        setScriptError(true);
        setScriptError('Payment processor loaded but not available');
        return;
      }
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      setScriptError(true);
    setScriptError('Failed to load payment processor script');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  scriptError && (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
      Payment processor failed to load. Please refresh the page.
      <button 
        onClick={() => window.location.reload()}
        className="ml-2 underline"
      >
        Refresh Now
      </button>
    </div>
  )

  // const saveOrderToFirestore = async (paymentId) => {
  //   try {
  //     const { data: user } = await supabase.auth.getUser();
  //     const orderId = `order_${Date.now()}`;
  //     const orderData = {
  //       orderId,
  //       userId: user.uid,
  //       userEmail: user.email,
  //       userName: user.displayName || '',
  //       tableNumber,
  //       items: cartItems.map(item => ({
  //         id: item.id,
  //         name: item.name,
  //         price: item.price,
  //         quantity: item.quantity,
  //         category: item.category,
  //         image: item.image,
  //         discountType: item.discountType,
  //         discountValue: item.discountValue
  //       })),
  //       subtotal,
  //       gst,
  //       total: totalAmount,
  //       paymentId,
  //       status: 'completed',
  //       createdAt: new Date(),
  //       paymentMethod: 'Razorpay',
  //       deliveryStatus: 'preparing',
  //       isTestOrder: true,
  //       environment: process.env.NODE_ENV,
  //     };

  //     await supabase.from('orders').insert(orderData);


  //     return orderId;
  //   } catch (error) {
  //     console.error('Error saving order:', error);
  //     throw error;
  //   }
  // };

  const handleRazorpay = () => {

    if(!isMounted) return;

    if (cartItems.length === 0) {
      setScriptError('No items in the cart');
      return;
    }

    if (!process.env.REACT_APP_RAZORPAY_TEST_KEY) {
      setScriptError('Payment processor not configured properly');
      console.error('Razorpay key missing:', process.env.REACT_APP_RAZORPAY_TEST_KEY);
      return;
    }
    
    if (!scriptLoaded) {
      setScriptError('Payment processor is still loading. Please wait a moment.');
      return;
    }

    if (!window.Razorpay) {
      setScriptError('Payment processor failed to initialize. Please refresh the page.');
      return;
    }

  //   const options = {
  //     key: process.env.REACT_APP_RAZORPAY_TEST_KEY || "rzp_test_4NyKx7fWGfysa9",
  //     amount: Math.round(totalAmount * 100),
  //     currency: 'INR',
  //     name: 'Table Tap',
  //     description: 'Order Payment',
  //     image: '/logo.png',
  //     handler: async function(response) {
  //       try {
  //         const orderId = await saveOrderToFirestore(response.razorpay_payment_id);
  //         clearCart();
  //         navigate('/order-success', { 
  //           state: { 
  //             orderId,
  //             totalAmount,
  //             tableNumber 
  //           } 
  //         });
  //       } catch (scriptError) {
  //         setScriptError('Payment successful but order tracking failed. Please contact support.');
  //         console.error(scriptError);
  //       }
  //     },
  //     prefill: {
  //       name: user?.user_metadata?.name || 'TEST USER',
  //       email: user?.email || 'test@xyz.com',
  //       contact: '2393293482'
  //     },
  //     notes: {
  //       tableNumber,
  //       userId: user?.uid,
  //       test_order: true
  //     },
  //     theme: { color: '#F37254' },
  //     method: { upi: true }
  //   };

  //   try {
  //     const rzp = new window.Razorpay(options);
  //     rzp.on('payment.failed', (response) => {
  //       setScriptError(`Payment failed: ${response.error.description}`);
  //       console.error('Payment failed:', response.error);
  //     });
  //     rzp.open();
  //   } catch (err) {
  //     setScriptError('Failed to initialize payment. Please try again.');
  //     console.error('Razorpay initialization scriptError:', err);

  //     if (!window.Razorpay) {
  //       const script = document.createElement('script');
  //       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  //       script.async = true;
  //       document.body.appendChild(script);
  //     }
  //   }
   };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full md:w-3/5 lg:w-2/5 bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Complete Your Payment</h2>

        {scriptError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {scriptError}
          </div>
        )}

        <div className="flex flex-col space-y-6">
          {/* Order Summary */}
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Order Summary</h3>
            <p className="text-sm text-gray-600 mb-2">Table: {tableNumber || 'Not specified'}</p>
            {cartItems.map(item => (
              <div key={`${item.id}-${item.category}`} className="flex justify-between py-2 border-b">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Razorpay UPI Button */}
          <button
            onClick={handleRazorpay}
            disabled={!scriptLoaded || cartItems.length === 0}
            className={`w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl shadow-md flex items-center justify-center transition-colors ${
              !scriptLoaded || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {!scriptLoaded ? 'Loading payment...' : `Pay ₹${totalAmount.toFixed(2)} via UPI`}
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