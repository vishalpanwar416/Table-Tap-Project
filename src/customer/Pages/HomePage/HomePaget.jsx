import React, { useState, useRef } from 'react';
import { 
  Sandwich, UtensilsCrossed, CupSoda, IceCream, Tag, User,
  ShoppingBag, CreditCard, Phone, HelpCircle, Settings, ArrowRight
} from 'lucide-react';
import Maincarosel from '../../components/HomeCarosel/Maincarosel';
import { MenuDropdown, Divider } from '../../components/MenuDropdown';
import RecommendationItem from '../../components/RecommendationItems';
import CategoryButtons from '../../components/CategoryButtons';
import BestSellers from '../../components/Bestseller';
import Header from '../../components/Header';
import Sidebar from '../../components/Slidebar';
import NotificationSidebar from '../../components/NotificationSlidebar';  
import CartSidebar from '../../components/CartSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../components/CartContent';
import LogoutPopup from '../../components/LogoutPopup';
import { useNavigate } from 'react-router-dom'; 
import DynamicGreeting from '../../components/Greetings';
// Import images
import {
  sushiImg,
  curryImg,
  lasagnaImg,
  cupcakeImg,
  burgerImg,
  pancakeImg,
  profileImg
} from '../../Photos/Index';


const categories = [
  { name: 'Snacks', icon: <Sandwich className="w-6 h-6" color="gray" /> },
  { name: 'Main Course', icon: <UtensilsCrossed className="w-6 h-6" color="gray" /> },
  { name: 'Beverages', icon: <CupSoda className="w-6 h-6" color="gray" /> },
  { name: 'Dessert', icon: <IceCream className="w-6 h-6" color="gray" /> },
  { name: 'Offers', icon: <Tag className="w-6 h-6" color="gray" /> },
];

const menuItems = {
  'Snacks': [
    { name: "Mexican Appetizer", price: "₹499", image: sushiImg },
    { name: "Pork Skewer", price: "₹399", image: burgerImg },
    { name: "Spring Rolls", price: "₹299", image: pancakeImg }
  ],
  'Main Course': [
    { name: "Chicken Curry", price: "₹650", image: curryImg },
    { name: "Beef Steak", price: "₹899", image: burgerImg },
    { name: "Pasta Alfredo", price: "₹599", image: lasagnaImg },
    { name: "Fish & Chips", price: "₹699", image: sushiImg }
  ],
  'Beverages': [
    { name: "Fresh Lemonade", price: "₹149", image: pancakeImg },
    { name: "Iced Tea", price: "₹129", image: cupcakeImg },
    { name: "Smoothie", price: "₹199", image: burgerImg }
  ],
  'Dessert': [
    { name: "Chocolate Cake", price: "₹349", image: cupcakeImg },
    { name: "Ice Cream Sundae", price: "₹249", image: pancakeImg },
    { name: "Cheesecake", price: "₹399", image: lasagnaImg }
  ],
  'Offers': [
    { name: "Combo Meal - 20% OFF", price: "₹499", image: burgerImg },
    { name: "Happy Hour - Buy 1 Get 1", price: "₹699", image: sushiImg }
  ]
};

const menuOptions = [
  { name: 'My Orders', icon: <ShoppingBag className="w-6 h-6" /> },
  { name: 'My Profile', icon: <User className="w-6 h-6" /> },
  { name: 'Payment Methods', icon: <CreditCard className="w-6 h-6" /> },
  { name: 'Contact Us', icon: <Phone className="w-6 h-6" /> },
  { name: 'Help & FAQs', icon: <HelpCircle className="w-6 h-6" /> },
  { name: 'Settings', icon: <Settings className="w-6 h-6" /> },
];
// HomePaget.jsx
const bestSellerItems = [
  { id: 1, image: sushiImg, name: "Sushi Platter", price: 499 }, // Added id
  { id: 2, image: curryImg, name: "Chicken Curry", price: 389 },
  { id: 3, image: lasagnaImg, name: "Lasagna", price: 199 },
  { id: 4, image: cupcakeImg, name: "Cupcake", price: 170 }
];
const recommendationItems = [
  { id: 5, image: burgerImg, name: "Burger", price: 499 },
  { id: 2, image: curryImg, name: "Chicken Curry", price: 389 },
  { id: 3, image: lasagnaImg, name: "Lasagna", price: 199 },
  { id: 6, image: pancakeImg, name: "Pancake", price: 169 },
  { id: 1, image: sushiImg, name: "Sushi Roll", price: 599 },
  { id: 4, image: cupcakeImg, name: "Choco Cupcake", price: 249 },
  { id: 7, image: burgerImg, name: "Cheese Burger", price: 399 },
  { id: 8, image: curryImg, name: "Paneer Curry", price: 349 }
];

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.4, ease: "easeOut" }
};

const staggerItems = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 }
};



export default function HomePage() {
  
  //const [activeTab, setActiveTab] = useState('home');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const categoryButtonsRef = useRef(null);
  const { addToCart, cartItems, removeItem, updateQuantity } = useCart();
  const toggleSearch = () => setIsSearchActive(!isSearchActive);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const start = container.scrollLeft;
      const containerWidth = container.clientWidth;
      
      container.scrollTo({
        left: start + scrollOffset,
        behavior: 'smooth'
      });
    }
  };
  
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsSidebarOpen(false); // Close profile sidebar if open
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsNotificationOpen(false); // Close notifications if open
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    // setIsNotificationOpen(false); // Close notifications if open
  };

  const handleCategoryClick = (category, event) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    
    setMenuPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left,
      width: buttonRect.width
    });
    
    if (activeCategory === category.name && menuOpen) {
      setMenuOpen(false);
    } else {
      setActiveCategory(category.name);
      setMenuOpen(true);
    }
  };

  const handleCloseMenu = () => setMenuOpen(false);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="bg-black text-white font-spartan-medium min-h-screen max-w-md mx-auto relative overflow-hidden flax-col"
    >
      <LogoutPopup 
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          navigate('/home');
          setIsLogoutOpen(false);
          setIsSidebarOpen(false); // Close sidebar after logout
        }}
      />
      {/* Profile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            profileImg={profileImg}
            menuOptions={menuOptions}
            userName="Vishal Panwar"
            userEmail="Vishalpanwar416@gmail.com"
            onLogout={() => setIsLogoutOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Add NotificationSidebar */}
      <AnimatePresence>
        {isNotificationOpen && (
          <NotificationSidebar 
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
        )}
      </AnimatePresence>
      
      
      {/* Header */}
      <Header
        isSearchActive={isSearchActive}
        toggleSearch={toggleSearch}
        toggleSidebar={toggleSidebar}  // Add this
        toggleNotifications={toggleNotifications}
        toggleCart={toggleCart}
        cartItems={cartItems}
      />
              
      <motion.div variants={staggerItems} className="flex-1">
        {/* Greeting */}
        <motion.div {...slideUp} className="px-4 mt-2">
          <DynamicGreeting />
        </motion.div>

        {/* Carousel */}
        <motion.div {...slideUp} className="px-5 mt-4">
          <Maincarosel />
        </motion.div>
      
        {/* Categories */}
        <motion.div {...slideUp} className="mt-4 bg-white rounded-t-[30px] rounded-b-none p-6 flex-1">
          <CategoryButtons 
            categories={categories}
            activeCategory={activeCategory}
            menuOpen={menuOpen}
            handleCategoryClick={handleCategoryClick}
            categoryButtonsRef={categoryButtonsRef}
          />

          <AnimatePresence>
            {menuOpen && (
              <MenuDropdown 
                menuOpen={menuOpen}
                handleCloseMenu={handleCloseMenu}
                menuPosition={menuPosition}
                activeCategory={activeCategory}
                menuItems={menuItems}
                categoryButtonsRef={categoryButtonsRef}
              />
            )}
          </AnimatePresence>

          <Divider />

          {/* Best Sellers */}
          <motion.div variants={staggerItems}>
            <BestSellers foodItems={bestSellerItems} onAddToCart={addToCart} />
          </motion.div>

          <Divider />

          {/* Recommendations */}
          <motion.div className="px-1 pb-2 text-black flex-1">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-thick font-spartan-bold">Our Best Recommendations</h2>
              <button 
                onClick={() => scroll(scrollRef.current?.clientWidth || 300)}
                className="p-2 rounded-full bg-white text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <motion.div 
              ref={scrollRef}
              className="grid grid-rows-2 grid-flow-col auto-cols-[minmax(45%,1fr)] gap-3 overflow-x-auto scrollbar-hide pb-2"
              variants={staggerItems}
              style={{ 
                scrollSnapType: 'x mandatory',
                minHeight: '320px' // Minimum height to ensure vertical space
              }}
            >
              {recommendationItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  id={item.id}
                  variants={itemAnimation}
                  className="h-[160px] w-[160px]" // Use aspect ratio for square items
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <RecommendationItem 
                    image={item.image}
                    id={item.id}
                    alt={item.name}
                    foodType={item.description}
                    price={item.price}
                    onAddToCart={() => addToCart(item)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}