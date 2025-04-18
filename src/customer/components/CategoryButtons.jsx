import { ChevronDown, Sandwich, UtensilsCrossed, CupSoda, IceCream, Tag } from 'lucide-react';

const CategoryButtons = ({  
  activeCategory, 
  handleCategoryClick, 
  categoryButtonsRef 
}) => {
  const categories = [
    { name: 'Snacks', icon: <Sandwich className="w-6 h-6" color="gray" /> },
    { name: 'Main Course', icon: <UtensilsCrossed className="w-6 h-6" color="gray" /> },
    { name: 'Beverages', icon: <CupSoda className="w-6 h-6" color="gray" /> },
    { name: 'Dessert', icon: <IceCream className="w-6 h-6" color="gray" /> },
    { name: 'Offers', icon: <Tag className="w-6 h-6" color="gray" /> },
  ];
  return (
    <div className="flex justify-between items-center" ref={categoryButtonsRef}>
      {categories.map((category, index) => (
        <button
          key={index}
          className="flex flex-col items-center relative focus:outline-none"
          onClick={(e) => handleCategoryClick(category, e)}
        >
          <div className={`${
            activeCategory === category.name 
              ? 'bg-orange-200 text-orange-700' 
              : 'bg-orange-100 text-orange-600'
          } rounded-3xl px-4 py-3 shadow-md hover:bg-orange-200 transition-all flex items-center justify-center w-16 h-16`}>
            {category.icon}
          </div>
          <span className="text-black text-xs mt-2">{category.name}</span>
            {category.name === activeCategory && (
            <ChevronDown className="h-3 w-3 text-black absolute -bottom-3" />
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryButtons;