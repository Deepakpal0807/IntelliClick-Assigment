'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Sun, Star, History } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/StoreProvider';


export default observer(function Navbar() {
  const [showFav, setShowFav] = useState(false);
  const [showHist, setShowHist] = useState(false);
  const store = useStore();

  const favRef = useRef<HTMLDivElement>(null);
  const histRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!favRef.current?.contains(e.target as Node)) setShowFav(false);
      if (!histRef.current?.contains(e.target as Node)) setShowHist(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Function to handle city click from favorites
  const handleCityClick = (city: string) => {
    store.addToHistory(city);
    // store.addFavorite(city);
    // Navigate to the weather page for this city
    window.open(`/weather/${encodeURIComponent(city)}`, '_blank');
  };

  // Use Effect to track updates to favorites or history and force re-render
  useEffect(() => {
    // This is just to ensure the component re-renders when favorites/history changes
    store.favorites; // This forces reactivity from MobX
    store.history; // This forces reactivity from MobX
  }, [store.favorites, store.history]);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md bg-gradient-to-br from-blue-400 to-purple-500 transition-colors duration-500 relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
          <Sun className="h-8 w-8 text-yellow-400" />
          <span>Weather Explorer</span>
        </Link>
        <div className="flex space-x-6 relative">
          <div ref={favRef} className="relative">
            <button onClick={() => setShowFav(prev => !prev)} className="flex items-center space-x-1 hover:underline">
              <Star className="h-5 w-5" />
              <span>Favorite</span>
            </button>
            {showFav && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-md z-10">
                {store.favorites.length ? (
                  store.favorites.map((city, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCityClick(city)}
                    >
                      {city}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No favorites</div>
                )}
              </div>
            )}
          </div>

          <div ref={histRef} className="relative">
            <button onClick={() => setShowHist(prev => !prev)} className="flex items-center space-x-1 hover:underline">
              <History className="h-5 w-5" />
              <span>History</span>
            </button>
            {showHist && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-md z-10">
                {store.history.length ? (
                  store.history.map((city, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCityClick(city)}
                    >
                      {city}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No history</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});
