import React from 'react';
import { ChevronLeft, Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../../customer/components/CartContent';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { cartItems, removeItem, updateQuantity } = useCart();

  // Calculate prices using Indian tax standards
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      let price = item.price;
      
      if (item.discountType === 'percentage') {
        price = item.price * (1 - item.discountValue/100);
      } else if (item.discountType === 'fixed') {
        price = item.price - item.discountValue;
      }
      
      return total + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const gst = subtotal * 0.05; // 5% GST for restaurants in India
  const total = subtotal + gst;

  const formatDate = () => {
    // Format date in DD/MM/YY format common in India
    const date = new Date();
    return `${date.getDate()} ${getMonthName(date.getMonth())}, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getHours() >= 12 ? 'pm' : 'am'}`;
  };

  const getMonthName = (monthIndex) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthIndex];
  };


  const handleGoBack = () => {
    // Go back to the previous page (cart)
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-black text-white p-2 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-center relative">
        <button onClick={handleGoBack} className="absolute left-4 text-orange-500">
          <ChevronLeft size={30} />
        </button>
        <h1 className="text-2xl font-bold">Confirm Order</h1>
      </div>

      {/* Main content */}
      <div className="bg-white text-black rounded-t-3xl p-6 mt-2 flex-1">

        {/* Order Summary */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Order Summary</h2>
          </div>

          <div className="border-t border-gray-200 pt-4">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${item.category}`} className="mb-4">
                <div className="flex items-start mb-4">
                  {/* Item image */}
                  <div className="w-20 h-20 overflow-hidden rounded-lg mr-4">
                    <img 
                      src={item.image || `/api/placeholder/80/80`} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  {/* Item details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600">{formatDate()}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      {/* <button 
                        onClick={() => removeItem(item.id, item.category)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <div className="bg-gray-300 px-1 rounded-lg">
                          Cancel Order
                        </div>
                      </button> */}
                      
                      <div className="flex items-center ">
                        <button 
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.category, item.quantity - 1);
                            }
                          }}
                          className="text-gray-700"
                        >
                          <div className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center">
                            <Minus size={16} />
                          </div>
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.category, item.quantity + 1)}
                          className="text-gray-700"
                        >
                          <div className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center">
                            <Plus size={16} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeItem(item.id, item.category)}
                      className="text-red-500 mt-8"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                
                {index < cartItems.length - 1 && (
                  <div className="border-t border-gray-200 my-4"></div>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 my-4"></div>
        </div>

        {/* Price Summary */}
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>GST (5%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 my-4"></div>
          <div className="flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => {
                navigate('/payment');
            }}
            className="bg-gray-300 text-black font-bold py-3 px-12 rounded-full text-xl w-full max-w-md"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;