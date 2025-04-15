import { X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Heart } from "lucide-react";

const MenuDropdown = ({
  menuOpen,
  handleCloseMenu,
  menuPosition,
  activeCategory,
  menuItems,
  categoryButtonsRef,
}) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const dropdownRef = useRef(null);
  const itemsPerPage = 5;
  const [isLiked, setIsLiked] = useState(false);
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  // Reset visible items when category changes or menu opens
  useEffect(() => {
    if (menuOpen && menuItems[activeCategory]) {
      setVisibleItems(menuItems[activeCategory].slice(0, itemsPerPage));
      setPage(1);
    }
  }, [activeCategory, menuOpen, menuItems, itemsPerPage]);

  // Memoize loadMoreItems with useCallback
  const loadMoreItems = useCallback(() => {
    if (loading || !menuItems[activeCategory]) return;
    
    const allItems = menuItems[activeCategory];
    if (visibleItems.length >= allItems.length) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const nextItems = allItems.slice(0, (page + 1) * itemsPerPage);
      setVisibleItems(nextItems);
      setPage(p => p + 1);
      setLoading(false);
    }, 300);
  }, [page, menuItems, activeCategory, visibleItems.length, loading, itemsPerPage]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!menuOpen) return;
    
    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [menuOpen, loadMoreItems]); // Added loadMoreItems to dependencies

  // Handle clicks outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        categoryButtonsRef.current &&
        !categoryButtonsRef.current.contains(event.target)
      ) {
        handleCloseMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen, handleCloseMenu, categoryButtonsRef]);

  if (!menuOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-0 z-20 text-black"
        onClick={(e) => {
          if (categoryButtonsRef.current && !categoryButtonsRef.current.contains(e.target)) {
            handleCloseMenu();
          }
        }}
      ></div>
      <div 
        ref={dropdownRef}
        className="absolute bg-white rounded-xl shadow-xl z-30 overflow-hidden animate-slide-down font-leagueSpartan-medium text-black"
        style={{
          top: `${menuPosition.top}px`,
          left: '0', 
          width: '100%',
          transform: 'translateY(10px)',
          height: `calc(100vh)`,
          maxHeight: 'none',
        }}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h3 className="text-black font-semibold text-center flex-1 text-xl font-LeagueSpartan-medium">
            {activeCategory} Menu
          </h3>
          <button 
            onClick={handleCloseMenu} 
            className="text-gray-500 hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 56px)' }}>
          {visibleItems.map((item, index) => (
            <div 
              key={index} 
              className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
            >
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover rounded-xl mb-3" 
                />
                <button 
                  className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1"
                  onClick={toggleLike}
                >
                  <Heart 
                    className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
                  />
                </button>
              </div>
              <div className="flex justify-between items-start mt-2">
                <div className="flex-1">
                  <p className="text-black font-medium text-lg">{item.name}</p>
                  <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                </div>
                <p className="text-black font-bold ml-4">{item.price}</p>
              </div>
              <div className="flex justify-end mt-3">
                <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
          
          {menuItems[activeCategory] && visibleItems.length < menuItems[activeCategory].length && (
            <div ref={loaderRef} className="flex justify-center p-4">
              {loading ? (
                <div className="animate-pulse text-gray-500">Loading more items...</div>
              ) : (
                <div className="text-gray-500 text-sm">Scroll to load more</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Divider = () => {
  return (
    <div className="my-4 w-full mx-auto h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
  );
};

export { MenuDropdown, Divider };