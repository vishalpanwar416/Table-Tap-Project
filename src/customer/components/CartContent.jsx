import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to cart function
  const addToCart = (item) => {
    setCartItems(prev => {
      const sanitizedPrice = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
        : item.price;
  
      const numericPriceItem = {
        ...item,
        price: sanitizedPrice
      };
      
      const existing = prev.find(i => 
        i.id === numericPriceItem.id && 
        i.category === numericPriceItem.category
      );
      
      if (existing) {
        return prev.map(i => 
          i.id === numericPriceItem.id && i.category === numericPriceItem.category ? 
          { ...i, quantity: i.quantity + 1 } : 
          i
        );
      }
      return [...prev, { ...numericPriceItem, quantity: 1 }];
    });
  };
  // Update quantity function
  const updateQuantity = (itemId, newQuantity, itemName, category) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId && 
        item.name === itemName && 
        item.category === category
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };
  
  const removeItem = (itemId, itemName, category) => {
    setCartItems(prev => 
      prev.filter(item => 
        !(item.id === itemId && 
          item.name === itemName && 
          item.category === category)
      )
    );
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeItem
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};