export interface City {
  name: string;
  country: string;
  timezone: string;
  population: number;
  latitude: number;
  longitude: number;
  geoname_id: string;
  ascii_name: string;
  alternate_names: string;
  dem: number;
  country_code: string;
  weather?: WeatherInfo;
}

export interface WeatherInfo {
  temperature: number;
  description: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}