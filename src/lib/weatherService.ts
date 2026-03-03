// src/lib/weatherService.ts

const fetchWeatherData = async (city) => {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${city}`);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return await response.json();
};

const getCurrentWeather = async (city) => {
    try {
        const data = await fetchWeatherData(city);
        return {
            temperature: data.current.temp_c,
            condition: data.current.condition.text
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
};

export { getCurrentWeather };