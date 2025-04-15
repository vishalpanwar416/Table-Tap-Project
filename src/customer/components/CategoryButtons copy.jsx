import { ChevronDown } from 'lucide-react';

const CategoryButtons = ({ 
  categories, 
  activeCategory, 
  menuOpen, 
  handleCategoryClick, 
  categoryButtonsRef 
}) => {
  return (
    <div className="flex justify-between" ref={categoryButtonsRef}>
      {categories.map((category, index) => (
        <button
          key={index}
          className="flex flex-col items-center relative focus:outline-none"
          onClick={(e) => handleCategoryClick(category, e)}
        >
          <div className={`${
            activeCategory === category.name && menuOpen 
              ? 'bg-orange-200 text-orange-700' 
              : 'bg-orange-100 text-orange-600'
          } rounded-3xl px-4 py-3 shadow-md hover:bg-orange-200 transition-all flex items-center justify-center w-16 h-16`}>
            {category.icon}
          </div>
          <span className="text-black text-xs mt-2">{category.name}</span>
          {category.name === activeCategory && menuOpen && (
            <ChevronDown className="h-3 w-3 text-black absolute -bottom-3" />
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryButtons;