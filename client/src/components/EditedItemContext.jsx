import React, { createContext, useState, useContext } from 'react';

const EditedItemContext = createContext();

export const EditedItemProvider = ({ children }) => {

  const [itemState, setItemState] = useState({
    item: {},
    menuTitle: "",
    quantity: 1,
    isEditMode: false,
    indexInCart: -1,
    newPrice: -1
  });

  const updateEditItemState = (key, value) => {
    setItemState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const resetEditItemState = () => {
    setItemState({
      item: {},
      menuTitle: "",
      quantity: 1,
      isEditMode: false,
      indexInCart: -1,
      newPrice: -1
    })
  };

  return (
    <EditedItemContext.Provider
      value={{
        itemState,
        setItemState,
        updateEditItemState,
        resetEditItemState
      }}
    >
      {children}
    </EditedItemContext.Provider>
  );
};

export const useItemContext = () => useContext(EditedItemContext);