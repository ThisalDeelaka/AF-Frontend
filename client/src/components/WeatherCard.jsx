
import { useEffect, useState } from "react";
import { getWeatherForCity } from "@/lib/api";
import { Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";
import ErrorMessage from "./ErrorMessage";

const WeatherCard = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherForCity(city);
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (city) {
      fetchWeather();
    }
  }, [city]);
  
  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="h-10 w-10 text-gray-300" />;
    
    const condition = weather.weather[0].main.toLowerCase();
    
    switch (condition) {
      case 'clear':
        return <Sun className="h-10 w-10 text-yellow-400" />;
      case 'clouds':
        return <Cloud className="h-10 w-10 text-gray-300" />;
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return <CloudRain className="h-10 w-10 text-blue-300" />;
      case 'snow':
        return <CloudSnow className="h-10 w-10 text-gray-100" />;
      default:
        return <Wind className="h-10 w-10 text-gray-400" />;
    }
  };
  
  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-700/50 rounded w-2/5" />
          <div className="h-10 w-10 bg-gray-700/50 rounded-full" />
        </div>
        <div className="h-12 bg-gray-700/50 rounded w-1/4 mb-3" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-700/50 rounded w-3/4" />
          <div className="h-4 bg-gray-700/50 rounded w-2/3" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  if (!weather) return null;
  
  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-200">Current Weather</h3>
        {getWeatherIcon()}
      </div>
      
      <div className="flex items-end gap-2 mb-4">
        <div className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</div>
        <div className="text-sm text-gray-400">
          Feels like {Math.round(weather.main.feels_like)}°C
        </div>
      </div>
      
      <p className="text-gray-300 capitalize mb-1">
        {weather.weather[0].description}
      </p>
      
      <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-400">
        <div>Humidity: {weather.main.humidity}%</div>
        <div>Wind: {Math.round(weather.wind.speed)} m/s</div>
      </div>
    </div>
  );
};

export default WeatherCard;
