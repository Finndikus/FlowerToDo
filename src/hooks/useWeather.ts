import { useState, useEffect, useCallback } from 'react';
import { WeatherData, WeatherCondition } from '@/types';
import { getWeatherCondition } from '@/lib/weatherService';

interface UseWeatherOptions {
  city?: string;
  lat?: number;
  lon?: number;
  autoRefresh?: number; // In milliseconds
}

export const useWeather = (options: UseWeatherOptions = {}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [description, setDescription] = useState<WeatherCondition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/weather';
      const params = new URLSearchParams();

      if (options.city) {
        params.append('city', options.city);
      } else if (options.lat !== undefined && options.lon !== undefined) {
        params.append('lat', options.lat.toString());
        params.append('lon', options.lon.toString());
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch weather data');
      }

      const data: WeatherData = await response.json();
      setWeather(data);
      setDescription(getWeatherCondition(data.weatherCode));
    } catch (err: any) {
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  }, [options.city, options.lat, options.lon]);

  useEffect(() => {
    fetchWeatherData();

    if (options.autoRefresh && options.autoRefresh > 0) {
      const interval = setInterval(fetchWeatherData, options.autoRefresh);
      return () => clearInterval(interval);
    }
  }, [fetchWeatherData, options.autoRefresh]);

  return { weather, description, loading, error, refresh: fetchWeatherData };
};