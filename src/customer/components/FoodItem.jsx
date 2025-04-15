// src/components/FoodItem.jsx
const FoodItem = ({ image, name, price }) => (
    <div className="min-w-[150px] rounded-xl overflow-hidden relative shadow group">
      <img src={image} alt={name} className="w-full h-24 object-cover" />
      <div className="absolute bottom-0 font-bold justify-center left-1/2 transform -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-in-out bg-black bg-opacity-60 pt-100 rounded-xl">
        <span className="text-white text-xs font-small">{name}</span>
      </div>
      <div className="absolute top-1 right-1 bg-black bg-opacity-60 px-0.5 py-0.5 rounded-xl">
        <span className="text-white text-xs font-semibold">₹{price}</span>
      </div>
    </div>
  );
  
  export default FoodItem;