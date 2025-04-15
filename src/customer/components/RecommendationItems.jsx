import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContent';

const RecommendationItem = ({ id, image, alt, foodType, price }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { cartItems, addToCart, updateQuantity, removeItem } = useCart();
  const cartItem = cartItems.find(item => item.id === id);
  const quantity = cartItem?.quantity || 0;

  const toggleLike = () => setIsLiked(!isLiked);

  const handleAddToCart = () => {
    addToCart({
      id,
      name: alt,
      price,
      image,
      foodType
    });
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden aspect-square">
      <div className="relative h-full w-full">
        <img 
          src={image} 
          alt={alt} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Like Button */}
      <button 
        className="absolute top-2 right-2 bg-white/70 rounded-full p-1"
        onClick={toggleLike}
      >
        <Heart 
          className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
        />
      </button>

      {/* Cart Controls */}
      {quantity > 0 ? (
        <div className="absolute bottom-1 left-1 bg-black/80 text-white px-2 py-1 rounded-xl z-10 flex items-center gap-2">
          <button 
            onClick={handleDecrement}
            className="text-xs hover:bg-black/90 px-1 rounded"
          >
            -
          </button>
          <span className="text-xs">{quantity}</span>
          <button 
            onClick={handleAddToCart}
            className="text-xs hover:bg-black/90 px-1 rounded"
          >
            +
          </button>
        </div>
      ) : (
        <button 
          className="absolute bottom-1 left-1 bg-black/80 text-white px-2 py-1 rounded-xl z-10 flex items-center gap-1"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-xs">Add</span>
        </button>
      )}

      {/* Price Display */}
      <div className="absolute bottom-1 right-1 bg-black/80 px-2 py-1 pt-1.5 rounded-xl z-10 flex items-center gap-1 text-white">
        <span className="text-white text-xs">₹{price}</span>
      </div>

      {/* Food Info */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="bg-gradient-to-t from-black/60 to-transparent rounded-lg pb-7 px-1">
          <h3 className="text-white text-sm font-medium truncate">{alt}</h3>
          <p className="text-[10px] text-gray-300 mt-1 truncate">{foodType}</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationItem;