import React, { createContext, useEffect, useState } from 'react';

export const ItemsContext = createContext({
  items: [],
  totalPrice: 0,
});

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    calculateTotalPrice();
  }, [items]);

  const calculateTotalPrice = () => {
    setTotalPrice(0);
    const newTotalPrice = items.reduce((total, item) => total + item.newPrice * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  };

  const removeFromCart = (indexToRemove) => {
    setItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
  };

  const updateItemCart = (newItem) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[newItem.indexInCart] = newItem;
      return newItems;
    })
  };

  const resetItems = ()=>{
    setItems([]);
  }

  return (
    <ItemsContext.Provider value={{ items, setItems, totalPrice, removeFromCart, updateItemCart, resetItems }}>
      {children}
    </ItemsContext.Provider>
  );
};
