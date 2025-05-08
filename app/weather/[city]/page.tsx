'use client';

import { useEffect, useState } from 'react';
import { WeatherResponse } from '../../types';
import { useWeatherStore } from '../../store/weatherStore';
import { ArrowUp,
  ArrowDown,
  Droplets,
  Wind,
  Gauge,
  Eye, Sunrise, Sunset } from 'lucide-react';

export default function WeatherPage({ params }: { params: { city: string } }) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const updateCityWeather = useWeatherStore((state) => state.updateCityWeather);
  const cityName = decodeURIComponent(params.city);
  
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apikey=process.env.NEXT_PUBLIC_api_key;
        console.log(apikey);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}&units=metric`
        );
        if (!response.ok) throw new Error('Weather data not found');
        const data: WeatherResponse = await response.json();
        setWeather(data);
        updateCityWeather(cityName, {
          temperature: data.main.temp,
          description: data.weather[0].description,
          high: data.main.temp_max,
          low: data.main.temp_min,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          pressure: data.main.pressure
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      }
    };
    fetchWeather();
  }, [cityName, updateCityWeather]);

  const formatTime = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

  const getBackgroundByIcon = (icon: string) => {
    const map: Record<string, string> = {
     '01d': 'from-yellow-200 to-orange-300',    // Clear Day: Soft sunny
  '01n': 'from-blue-gray-900 to-indigo-900', // Clear Night: Calm night sky

  '02d': 'from-sky-200 to-blue-400',         // Few Clouds Day
  '02n': 'from-indigo-600 to-blue-800',      // Few Clouds Night

  '03d': 'from-gray-200 to-gray-400',        // Scattered Clouds Day
  '03n': 'from-gray-500 to-gray-800',        // Scattered Clouds Night

  '04d': 'from-gray-300 to-gray-600',        // Broken Clouds Day
  '04n': 'from-gray-600 to-gray-900',        // Broken Clouds Night

  '09d': 'from-blue-200 to-blue-500',        // Shower Rain Day
  '09n': 'from-blue-600 to-indigo-900',      // Shower Rain Night

  '10d': 'from-indigo-200 to-blue-400',      // Rain Day
  '10n': 'from-indigo-700 to-blue-900',      // Rain Night

  '11d': 'from-yellow-300 to-red-500',       // Thunderstorm Day
  '11n': 'from-purple-600 to-indigo-900',    // Thunderstorm Night

  '13d': 'from-blue-100 to-sky-200',         // Snow Day
  '13n': 'from-blue-200 to-white',           // Snow Night

  '50d': 'from-gray-200 to-gray-400',        // Mist Day
  '50n': 'from-gray-500 to-gray-800'         // Mist Night
    };
    return map[icon] || 'from-blue-400 to-purple-500';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
        <div className="bg-white/20 p-8 rounded-lg shadow-md backdrop-blur-md">
          <h2 className="text-2xl font-bold text-red-200 mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const backgroundGradient = getBackgroundByIcon(weather.weather[0].icon);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} p-8 text-white`}>
      <div className="max-w-4xl mx-auto bg-white/10 rounded-lg shadow-lg backdrop-blur-md">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold">{cityName}</h1>
              <p className="text-white/80 mt-1">{weather.sys.country}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Sunrise className="w-5 h-5" />
                <p className="text-lg">{formatTime(weather.sys.sunrise)}</p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Sunset className="w-5 h-5" />
                <p className="text-lg">{formatTime(weather.sys.sunset)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/20 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</span>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    className="w-20 h-20"
                  />
                </div>
                <p className="text-xl capitalize">{weather.weather[0].description}</p>
                <p className="text-white/80">Feels like: {Math.round(weather.main.feels_like)}°C</p>
              </div>
            </div>

           
<div className="bg-white/20 p-6 rounded-lg shadow-sm">
  <h2 className="text-2xl font-semibold mb-4">Details</h2>
  <div className="grid grid-cols-2 gap-4">
    {/* High */}
    <div className="flex items-center gap-3">
      <ArrowUp className="h-5 w-5 text-white/70" />
      <div>
        <p className="text-white/70">High</p>
        <p className="text-xl font-semibold">{Math.round(weather.main.temp_max)}°C</p>
      </div>
    </div>

    {/* Low */}
    <div className="flex items-center gap-3">
      <ArrowDown className="h-5 w-5 text-white/70" />
      <div>
        <p className="text-white/70">Low</p>
        <p className="text-xl font-semibold">{Math.round(weather.main.temp_min)}°C</p>
      </div>
    </div>

    {/* Humidity */}
    <div className="flex items-center gap-3">
      <Droplets className="h-5 w-5 text-white/70" />
      <div>
        <p className="text-white/70">Humidity</p>
        <p className="text-xl font-semibold">{weather.main.humidity}%</p>
      </div>
    </div>

    {/* Wind Speed */}
    <div className="flex items-center gap-3">
      <Wind className="h-5 w-5 text-white/70" />
      <div>
        <p className="text-white/70">Wind Speed</p>
        <p className="text-xl font-semibold">{weather.wind.speed} m/s</p>
      </div>
    </div>

    {/* Pressure */}
    <div className="flex items-center gap-3">
      <Gauge className="h-5 w-5 text-white/70" />
      <div>
        <p className="text-white/70">Pressure</p>
        <p className="text-xl font-semibold">{weather.main.pressure} hPa</p>
      </div>
    </div>

    {/* Visibility */}
    <div className="flex items-center gap-3">
      <Eye className="h-5 w-5 text-white/70" />
      <div>
        <p className="text-white/70">Visibility</p>
        <p className="text-xl font-semibold">
          {(weather.visibility / 1000).toFixed(1)} km
        </p>
      </div>
    </div>
  </div>
</div>
          </div>

          <div className="mt-8">
           <iframe
  title="City Map"
  width="100%"
  height="300"
  frameBorder="0"
  src={`https://www.openstreetmap.org/export/embed.html?bbox=${weather.coord.lon - 0.005},${weather.coord.lat - 0.005},${weather.coord.lon + 0.005},${weather.coord.lat + 0.005}&layer=mapnik&marker=${weather.coord.lat},${weather.coord.lon}`}
  className="rounded-lg shadow-sm w-full"
/>

          </div>
        </div>
      </div>
    </div>
  );
}
