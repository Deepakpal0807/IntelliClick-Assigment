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
    addFavorite(city: string) {
      if (!self.favorites.includes(city)) {
        self.favorites.push(city);
      }
    },
    removeFavorite(city: string) {
      self.favorites = self.favorites.filter(fav => fav !== city);
    },
    addToHistory(city: string) {
      const uniqueHistory = self.history.filter(c => c !== city);
      self.history = [city, ...uniqueHistory].slice(0, 10);
    },
  }));

const LOCAL_STORAGE_KEY = 'weather-app-store';

export const createStore = () => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);

  let store: RootInstance;

  try {
    store = savedData
      ? RootStore.create(JSON.parse(savedData))
      : RootStore.create({ favorites: [], history: [] });
  } catch (error) {
    console.error('Failed to load store from localStorage:', error);
    store = RootStore.create({ favorites: [], history: [] });
  }

  onSnapshot(store, snapshot => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
  });

  return store;
};

export type RootInstance = Instance<typeof RootStore>;
