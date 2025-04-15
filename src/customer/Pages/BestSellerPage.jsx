import React, { useState } from 'react';
import { Heart, ShoppingBag, User, CreditCard, Phone, HelpCircle, Settings, ArrowLeft } from 'lucide-react';
import { sushiImg, curryImg, lasagnaImg, cupcakeImg } from '../Photos/Index';
import Header from '../../customer/components/Header';
import Sidebar from '../../customer/components/Slidebar';
import NotificationSidebar from '../../customer/components/NotificationSlidebar';
import CartSidebar from '../../customer/components/CartSidebar';
import { profileImg } from '../../customer/Photos/Index';
import { useCart } from '../components/CartContent';
import { useNavigate } from 'react-router-dom';

const menuOptions = [
  { name: 'My Orders', icon: <ShoppingBag className="w-6 h-6" /> },
  { name: 'My Profile', icon: <User className="w-6 h-6" /> },
  { name: 'Payment Methods', icon: <CreditCard className="w-6 h-6" /> },
  { name: 'Contact Us', icon: <Phone className="w-6 h-6" /> },
  { name: 'Help & FAQs', icon: <HelpCircle className="w-6 h-6" /> },
  { name: 'Settings', icon: <Settings className="w-6 h-6" /> },
];

const bestSellerItems = [
  { id: 1, image: sushiImg, name: "Sushi Platter", price: 499, description: "Fresh sushi selection" },
  { id: 2, image: curryImg, name: "Chicken Curry", price: 389, description: "Spicy chicken curry" },
  { id: 3, image: lasagnaImg, name: "Lasagna", price: 199, description: "Classic Italian lasagna" },
  { id: 4, image: cupcakeImg, name: "Cupcake", price: 170, description: "Sweet vanilla cupcake" }
];

const RecommendationItem = ({ image, name, price, description, item }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { cartItems, addToCart, updateQuantity, removeItem } = useCart();
  const cartItem = cartItems.find(i => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const toggleLike = () => setIsLiked(!isLiked);

  const handleDecrement = () => {
    if (quantity === 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="relative rounded-xl overflow-hidden mb-2 flex-1">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Like Button */}
        <button 
          className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1"
          onClick={toggleLike}
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
          />
        </button>

        {/* Price Display */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          ₹{price.toFixed(2)}
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
    <div className="flex justify-center items-start bg-black min-h-screen p-4">
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
          menuOptions={menuOptions}
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
          <h1 className="text-2xl font-semibold text-center text-white mb-6 font-league-spartan">Best Seller</h1>
        </div>
        
        <div className="bg-white rounded-3xl p-4 flex-1 flex flex-col min-h-[calc(100vh-200px)]">
          <p className="text-black font-medium text-lg mb-4">Discover our most popular dishes!</p>
          
          <div className="grid grid-cols-2 gap-4">
            {bestSellerItems.map((item) => (
              <div key={item.id} className="aspect-square">
                <RecommendationItem
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