
const PriceDisplay = ({ item  }) => {
    const calculatePrice = () => {
      if (item.discountType === 'percentage') {
        return item.price * (1 - item.discountValue/100);
      }
      if (item.discountType === 'fixed') {
        return item.price - item.discountValue;
      }
      return item.price;
    };
  
    const finalPrice = calculatePrice();
    const hasDiscount = finalPrice < item.price;
  
    return (
      <div className="flex flex-col items-end">
        {hasDiscount ? (
          <>
            <span className="text-gray-400 line-through text-sm">
              ₹{item.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-green-600 font-semibold">
                ₹{finalPrice.toFixed(2)}
              </span>
              {item.discountType === 'percentage' && (
                <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                  {item.discountValue}% OFF
                </span>
              )}
            </div>
          </>
        ) : (
          <span className="text-white">
            ₹{item.price.toFixed(2)}
          </span>
        )}
      </div>
    );
  };
  
  export default PriceDisplay;