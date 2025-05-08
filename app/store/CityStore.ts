// stores/CityStore.ts
import { types, Instance } from 'mobx-state-tree';

export const CityModel = types.model('CityModel', {
  name: types.string,
});

export const RootStore = types
  .model('RootStore', {
    favorites: types.array(types.string),
    history: types.array(types.string),
  })
  .actions(self => ({
    // Add a city to favorites
    addFavorite(city: string) {
      if (!self.favorites.includes(city)) {
        self.favorites.push(city);
      }
    },
    // Remove a city from favorites
    removeFavorite(city: string) {
      self.favorites = self.favorites.filter(favorite => favorite !== city);
    },
    // Add a city to history (with a limit of 10)
    addToHistory(city: string) {
      const existing = self.history.filter(c => c !== city);
      self.history = [city, ...existing].slice(0, 10);
    },
  }));

export const createStore = () =>
  RootStore.create({
    favorites: [],
    history: [],
  });

export type RootInstance = Instance<typeof RootStore>;
