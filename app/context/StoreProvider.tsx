
'use client';

import React, { createContext, useContext } from 'react';
import { createStore, RootInstance } from '../store/CityStore';
import { onSnapshot } from 'mobx-state-tree';

const StoreContext = createContext<RootInstance | null>(null);

const store = createStore();

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  // Optional: persist with localStorage
  onSnapshot(store, snapshot => {
    localStorage.setItem('cityStore', JSON.stringify(snapshot));
  });

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
};
