import { types, Instance, onSnapshot } from 'mobx-state-tree';

export const CityModel = types.model('CityModel', {
  name: types.string,
});

export const RootStore = types
  .model('RootStore', {
    favorites: types.array(types.string),
    history: types.array(types.string),
  })
 .actions(self => ({
    // Add a city to favorites (if not already there)
    addFavorite(city: string) {
      if (!self.favorites.includes(city)) {
        self.favorites.push(city);
      }
    },

    // Remove a city from favorites
    removeFavorite(city: string) {
      // Use replace() to update the MST array
      self.favorites.replace(self.favorites.filter(fav => fav !== city));
    },

    // Add a city to the history, ensuring no duplicates and limiting to the last 10 cities
    addToHistory(city: string) {
      const uniqueHistory = self.history.filter(c => c !== city);
      // Use replace() to update the MST array
      self.history.replace([city, ...uniqueHistory].slice(0, 10));
    },
  }));

const LOCAL_STORAGE_KEY = 'weather-app-store';

export const createStore = () => {
  let savedData: string | null = null;

  // Only access localStorage in the browser
  if (typeof window !== 'undefined') {
    savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  }

  let store: RootInstance;

  try {
    store = savedData
      ? RootStore.create(JSON.parse(savedData))
      : RootStore.create({ favorites: [], history: [] });
  } catch (error) {
    console.error('Failed to load store from localStorage:', error);
    store = RootStore.create({ favorites: [], history: [] });
  }

  // Subscribe to changes and save to localStorage (only in browser)
  if (typeof window !== 'undefined') {
    onSnapshot(store, snapshot => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
    });
  }

  return store;
};

export type RootInstance = Instance<typeof RootStore>;
