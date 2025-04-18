import React, { useState, useEffect ,useRef} from 'react';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '../../customer/components/Header';
import Sidebar from '../../customer/components/Slidebar';
import NotificationSidebar from '../../customer/components/NotificationSlidebar';
import CartSidebar from '../../customer/components/CartSidebar';
import { profileImg } from '../../customer/Photos/Food/Index';
import { useCart } from '../../customer/components/CartContent';
import { useNavigate } from 'react-router-dom';
import { allFoodItems } from '../../customer/FoodData/foodData';
import { useLikes } from '../../customer/components/LikesContent';


const bestSellerItems = allFoodItems.filter(item => 
  item.tags?.some(tag => tag.toLowerCase() === 'bestseller')
);

const BestSellerItem = ({ image, name, price, description, item }) => {
  const { toggleLike, likedItems } = useLikes();
  const { cartItems, addToCart, updateQuantity, removeItem } = useCart();
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

  return (
    <div className="relative h-full flex flex-col ">
      <div className="relative rounded-xl overflow-hidden mb-2 flex-1">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Like Button */}
        <button 
          className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1"
            onClick={() => toggleLike({
            id: item.id,
            name: name,
            category: item.category,
            price: price,
            image: image,
          })}
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
          />
        </button>

        {/* Price Display */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
        ₹{Number(price).toFixed(2)}
        </div>
      </div>
      
      <div className="text-black">
        <h3 className="font-medium text-sm">{name}</h3>
        <div className="flex justify-between items-center mt-1">
          <p className="text-[10px] text-gray-500 truncate w-3/4">{description}</p>
          
          {/* Cart Controls - Original Position */}
          {quantity > 0 ? (
            <div className="flex items-center bg-black/80 rounded-md px-1 py-1 gap-1">
              <button 
                onClick={handleDecrement}
                className="text-white text-xs hover:bg-black/90 px-1 rounded"
              >
                -
              </button>
              <span className="text-white text-xs">{quantity}</span>
              <button 
                onClick={() => addToCart(item)}
                className="text-white text-xs hover:bg-black/90 px-1 rounded"
              >
                +
              </button>
            </div>
          ) : (
            <button 
              className="bg-black text-black p-1 rounded"
              onClick={() => addToCart(item)}
            >
              <ShoppingBag className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const BestSellerPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    
    const handleScroll = () => {
      const scrollThreshold = 50; // Adjust this value to change when color starts transitioning
      setIsScrolled(container.scrollTop > scrollThreshold);
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  const toggleSearch = () => setIsSearchActive(!isSearchActive);
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsSidebarOpen(false);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsNotificationOpen(false);
  };
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <div className={`flex justify-center items-start min-h-screen p-4 transition-colors duration-300 ${
      isScrolled ? 'bg-black' : 'bg-black'
    }`}>
      <div className="w-full max-w-[390px] h-screen flex flex-col">
        <button 
          className="absolute left-4 top-8 text-orange-500"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft size={24} />
        </button>

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          profileImg={profileImg}
          userName="Vishal Panwar"
          userEmail="Vishalpanwar416@gmail.com"
        />

        <NotificationSidebar 
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
        />

        <Header 
          isSearchActive={isSearchActive}
          toggleSearch={toggleSearch}
          toggleSidebar={toggleSidebar}
          toggleNotifications={toggleNotifications}
          toggleCart={toggleCart}
          cartItems={cartItems}
        />
        
        <div className="mb-3 pt-4">
          <h1 className="text-2xl font-semibold text-center text-white mb-6 font-spartan-medium">Best Seller</h1>
        </div>
        
        <div 
          ref={containerRef}
          className="bg-white rounded-3xl p-4 flex-1 flex flex-col min-h-[calc(100vh-200px)] overflow-y-auto"
        >
          <p className="text-black font-medium text-lg mb-4 font-spartan-medium">Discover our most popular dishes!</p>
          
          <div className="grid grid-cols-2 gap-4">
            {bestSellerItems.map((item) => (
              <div key={item.id} className="aspect-square">
                <BestSellerItem
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  item={item}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellerPage;