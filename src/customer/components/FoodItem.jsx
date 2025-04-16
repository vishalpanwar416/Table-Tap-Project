const FoodItem = ({ image, name, price }) => (
  <div className="min-w-[150px] rounded-xl overflow-hidden relative shadow-lg group hover:shadow-xl transition-shadow duration-200">
    <img src={image} alt={name} className="w-full h-24 object-cover" />
    
    {/* Name Overlay - Fixed padding and positioning */}
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-in-out bg-black bg-opacity-60 w-full text-center p-2">
      <span className="text-white text-xs font-medium">{name}</span>
    </div>

    {/* Price Display - Fixed number formatting */}
    <div className="absolute top-1 right-1 bg-black bg-opacity-60 px-2 py-1 rounded-md">
      <span className="text-white text-xs font-semibold">
        ₹{typeof price === 'number' ? price.toFixed(2) : Number(price).toFixed(2)}
      </span>
    </div>
  </div>
);

export default FoodItem;