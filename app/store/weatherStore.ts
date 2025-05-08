import { create } from 'zustand';
import { City, WeatherInfo } from '../types';

interface WeatherStore {
  cities: City[];
  setCities: (cities: City[]) => void;
  updateCityWeather: (cityName: string, weather: WeatherInfo) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  cities: [],
  setCities: (cities) => set({ cities }),
  updateCityWeather: (cityName, weather) =>
    set((state) => ({
      cities: state.cities.map((city) =>
        city.name === cityName ? { ...city, weather } : city
      ),
    })),
}));