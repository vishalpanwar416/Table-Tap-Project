import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContent';

const CartSlidebar = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeItem } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

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
      {isOpen && (
        <>
          <motion.div
            key="cart-content"
            className="fixed top-0 right-0 h-full w-full bg-black z-50 overflow-hidden rounded-l-[80px]"
            style={{ maxWidth: '70%' }}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="pt-16 pb-4 px-6 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center">
                <ShoppingBag className="w-6 h-6 text-white mr-3" />
                <h2 className="text-2xl font-bold text-white">Your Cart</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="h-[calc(100vh-160px)] overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-400 text-center mt-8">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between mb-4 p-2 bg-gray-800 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-1 ml-4">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-gray-400 text-sm">₹{item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-700 text-white px-2 py-1 rounded-l"
                        >
                          -
                        </button>
                        <span className="bg-gray-700 px-3 py-1 text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-700 text-white px-2 py-1 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-400 ml-4"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 p-4">
                <div className="flex justify-between mb-4">
                  <span className="text-white">Total:</span>
                  <span className="text-white font-bold">₹{calculateTotal().toFixed(2)}</span>
                </div>
                <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            key="cart-overlay"
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSlidebar;