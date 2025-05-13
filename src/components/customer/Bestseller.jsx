import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from './CartContent';
import { useLikes } from './LikesContent';
import PriceDisplay from './PriceDisplay';

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
    const handleAddToCart = () => {
      addToCart(item);
    };
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
              Loading Best sellers...
            </button>
          </div>
        </div>
      );
    }

    return (
        <div className="w-[150px] flex-shrink-0 rounded-xl overflow-hidden relative shadow-lg group 
                      hover:shadow-xl transition-shadow duration-200
                      md:w-[250px] md:h-[200px]">
        <img src={item.image} alt={item.name} className="w-full h-28 md:h-[200px] object-cover" />
        <button 
        className="absolute top-2 left-2 bg-white/70 rounded-full p-1 z-10"
        onClick={() => toggleLike(item)}
      >
        <Heart 
          className={`h-4 w-4 md:w-6 md:h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
        />
      </button>
        {/* Price Tag */}
        <div className="absolute top-1 right-1 bg-black/80 px-1 rounded-md text-xs font-medium text-white md:w-[64px] md:h-5">
          <PriceDisplay
          item={item}
          className='md:text-[15px]'
          />
        </div>

        {/* Quantity Controls or Add Button */}
        {quantity > 0 ? (
        <div className="absolute bottom-1 right-2 bg-black/80 text-white px-2 py-1 rounded-xl z-10 flex items-center gap-2 md: h-7">
          <button 
            onClick={handleDecrement}
            className="text-xs hover:bg-black/90 px-1 rounded md:text-[90%]"
          >
            -
          </button>
          <span className="text-xs md:text-[90%]">{quantity}</span>
          <button 
            onClick={handleAddToCart}
            className="text-xs hover:bg-black/90 px-1 rounded md:text-[90%]"
          >
            +
          </button>
        </div>
      ) : (
        <button 
          className="absolute bottom-1 right-1 bg-black/80 text-white px-2 py-1 rounded-xl z-10 flex items-center gap-1"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="w-4 h-4 md:h-6 md:w-6" />
          <span className="text-[0%] md:text-[90%]">Add</span>
        </button>
      )}

        {/* Food Name Overlay */}
        <div className="absolute bottom-0 left-0 text-center px-0.2 pb-0.2 ">
          <span className="text-white text-xs font- bg-black/35 rounded-xl px-2 py-1 md:text-xl">
            {item.name}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6 px-1 text-black">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-thick font-spartan-bold md:text-3xl">Best Seller</h2>
        <button 
          onClick={handleViewAll}
          className="text-orange-500 text-sm flex items-center md:text-xl hover:underline"
        >
          View All <span className="ml-1 md:text-xl">›</span>
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