import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from './CartContent';
import { useLikes } from './LikesContent';

const BestSellers = ({ foodItems }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/best-sellers');
  };

  const FoodItem = ({ item }) => {
    const { cartItems, addToCart, updateQuantity, removeItem } = useCart();
    const { toggleLike,likedItems } = useLikes();
    const cartItem = cartItems.find(i => i.id === item.id);
    const quantity = cartItem?.quantity || 0;

    const isLiked = likedItems.some(likedItem => likedItem.id === item.id);
    const handleDecrement = () => {
      if (quantity === 1) {
        removeItem(item.id, item.category);
      } else {
        updateQuantity(item.id, item.category, quantity - 1); 
      }
    };

    if (!foodItems || !Array.isArray(foodItems)) {
      return (
        <div className="mt-6 px-1 text-black">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-thick font-spartan-bold">Best Seller</h2>
            <button className="text-orange-500 text-sm flex items-center hover:underline">
              Loading best sellers...
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-w-[150px] rounded-xl overflow-hidden relative shadow-lg group hover:shadow-xl transition-shadow duration-200">
        <img src={item.image} alt={item.name} className="w-full h-24 object-cover" />
        <button 
        className="absolute top-2 left-2 bg-white/70 rounded-full p-1 z-10"
        onClick={() => toggleLike(item)}
      >
        <Heart 
          className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
        />
      </button>
        {/* Price Tag */}
        <div className="absolute top-0 right-0 bg-black/80 px-1 rounded-md">
          <span className="text-white text-xs font-semibold">₹{item.price}</span>
        </div>

        {/* Quantity Controls or Add Button */}
        {quantity > 0 ? (
          <div className="absolute bottom-0 right-0 flex items-center bg-black/80 rounded-md px-1 py-1 space-x-1">
            <button 
              onClick={handleDecrement}
              className="text-white text-xs hover:bg-black/90 px-1 rounded"
            >
              -
            </button>
            <span className="text-white text-xs">{quantity}</span>
            <button 
              onClick={() => addToCart({
                ...item,
                category: item.category
              })}
              className="text-white text-xs hover:bg-black/90 px-1 rounded"
            >
              +
            </button>
          </div>
        ) : (
          <button 
            onClick={() => addToCart(item)}
            className="absolute bottom-0 right-0 px-1 py-1 bg-black/80 text-white rounded-md
                      text-[10px] font-medium hover:bg-black/90 transition-colors duration-200"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        )}

        {/* Food Name Overlay */}
        <div className="absolute bottom-0 left-0 text-center px-0.2 pb-0.2">
          <span className="text-white text-xs font-medium bg-black/20 rounded-md px-2 py-1">
            {item.name}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6 px-1 text-black">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-thick font-spartan-bold">Best Seller</h2>
        <button 
          onClick={handleViewAll}
          className="text-orange-500 text-sm flex items-center hover:underline"
        >
          View All <span className="ml-1">›</span>
        </button>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-2 scroll-smooth ">
        {foodItems
          .filter(item => 
            item.tags?.some(tag => tag.toLowerCase() === 'bestseller')
          )
          .map((item) => (
            <FoodItem 
              key={item.id}
              item={item}
            />
          ))}
      </div>
    </div>
  );
};

export default BestSellers;