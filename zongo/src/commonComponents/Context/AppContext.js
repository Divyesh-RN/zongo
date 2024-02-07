// AppContext.js
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeArray, setActiveArray] = useState([]);

  return (
    <AppContext.Provider value={{ activeArray, setActiveArray }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
