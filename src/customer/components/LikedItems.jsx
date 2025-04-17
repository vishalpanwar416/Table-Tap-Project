import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartContent';
import { useLikes } from './LikesContent';

const LikedItems = ({ foodItems }) => {
  const navigate = useNavigate();
  const { likedItems } = useLikes();
  const { cartItems, addToCart, updateQuantity, removeItem } = useCart();

  if (!foodItems || !Array.isArray(foodItems)) return null;
  
  const likedFoodItems = foodItems.filter(item => 
    likedItems.some(likedItem => likedItem.id === item.id)
  );

  if (likedFoodItems.length === 0) return null;

  const FoodItem = ({ item }) => {
    const cartItem = cartItems.find(i => i.id === item.id);
    const quantity = cartItem?.quantity || 0;

    const handleDecrement = () => {
      if (quantity === 1) removeItem(item.id, item.category);
      else updateQuantity(item.id, quantity - 1, item.category);
    };

    return (
      <div className="min-w-[150px] rounded-xl overflow-hidden relative shadow-lg group hover:shadow-xl transition-shadow duration-200">
        <img src={item.image} alt={item.name} className="w-full h-24 object-cover" />
        <div className="absolute top-0 right-0 bg-black/80 px-1 rounded-md">
          <span className="text-white text-xs font-semibold">₹{item.price}</span>
        </div>
        {quantity > 0 ? (
          <div className="absolute bottom-0 right-0 flex items-center bg-black/80 rounded-md px-1 py-1 space-x-1">
            <button onClick={handleDecrement} className="text-white text-xs hover:bg-black/90 px-1 rounded">-</button>
            <span className="text-white text-xs">{quantity}</span>
            <button onClick={() => addToCart(item)} className="text-white text-xs hover:bg-black/90 px-1 rounded">+</button>
          </div>
        ) : (
          <button 
            onClick={() => addToCart({
              ...item,
              category: item.category
            })}
            className="absolute bottom-0 right-0 px-1 py-1 bg-black/80 text-white rounded-md text-[10px] font-medium hover:bg-black/90 transition-colors duration-200"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        )}
        <div className="absolute bottom-0 left-0 text-center px-0.2 pb-0.2">
          <span className="text-white text-xs font-medium bg-black/20 rounded-md px-2 py-1">{item.name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6 px-1 text-black">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-thick font-spartan-bold">Liked Items</h2>
        <button onClick={() => navigate('/liked-items')} className="text-orange-500 text-sm flex items-center hover:underline">
          View All <span className="ml-1">›</span>
        </button>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-2 scroll-smooth">
        {likedFoodItems.map(item => <FoodItem key={item.id} item={item} />)}
      </div>
    </div>
  );
};

export default LikedItems;