// src/lib/weatherService.ts
import { WeatherData, WeatherCondition } from "@/types";

export const getWeatherCondition = (code: number): WeatherCondition => {
    const conditions: Record<number, WeatherCondition> = {
        0: { description: "Klarer Himmel", emoji: "☀️" },
        1: { description: "Meist klar", emoji: "🌤️" },
        2: { description: "Teilweise bewölkt", emoji: "⛅" },
        3: { description: "Bewölkt", emoji: "☁️" },
        45: { description: "Nebelig", emoji: "🌫️" },
        48: { description: "Nebelig", emoji: "🌫️" },
        51: { description: "Leichter Nieselregen", emoji: "🌦️" },
        53: { description: "Nieselregen", emoji: "🌦️" },
        55: { description: "Starker Nieselregen", emoji: "🌦️" },
        61: { description: "Leichter Regen", emoji: "🌧️" },
        63: { description: "Regen", emoji: "🌧️" },
        65: { description: "Starker Regen", emoji: "🌧️" },
        71: { description: "Leichter Schnee", emoji: "🌨️" },
        73: { description: "Schnee", emoji: "🌨️" },
        75: { description: "Starker Schnee", emoji: "❄️" },
        77: { description: "Schneegriesel", emoji: "🌨️" },
        80: { description: "Leichte Regenschauer", emoji: "🌦️" },
        81: { description: "Regenschauer", emoji: "🌧️" },
        82: { description: "Starke Regenschauer", emoji: "🌧️" },
        85: { description: "Leichte Schneeschauer", emoji: "🌨️" },
        86: { description: "Starke Schneeschauer", emoji: "❄️" },
        95: { description: "Gewitter", emoji: "⛈️" },
        96: { description: "Schweres Gewitter", emoji: "⛈️" },
        99: { description: "Schweres Gewitter", emoji: "⛈️" },
    };

    return conditions[code] || { description: "Unbekannt", emoji: "❓" };
};

export const fetchWeather = async (lat?: number, lon?: number): Promise<WeatherData> => {
    const defaultLat = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT || "52.52");
    const defaultLon = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LON || "13.405");
    const apiUrl = process.env.NEXT_PUBLIC_WEATHER_API_URL || "https://api.open-meteo.com/v1/forecast";

    const targetLat = lat ?? defaultLat;
    const targetLon = lon ?? defaultLon;

    const url = `${apiUrl}?latitude=${targetLat}&longitude=${targetLon}&current_weather=true`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch weather data");
    }

    const data = await res.json();
    const current = data.current_weather;

    return {
        temperature: current.temperature,
        windSpeed: current.windspeed,
        weatherCode: current.weathercode,
    };
};

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=de&format=json`;

    const geoRes = await fetch(geocodeUrl);
    if (!geoRes.ok) {
        throw new Error("Failed to fetch geocoding data");
    }

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Stadt nicht gefunden");
    }

    const location = geoData.results[0];
    return fetchWeather(location.latitude, location.longitude);
};