import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWeatherCondition, fetchWeather, fetchWeatherByCity } from '@/lib/weatherService';

// Mock the global fetch API
global.fetch = vi.fn();

describe('weatherService', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Set default env vars for tests
        process.env.NEXT_PUBLIC_DEFAULT_LAT = '52.52';
        process.env.NEXT_PUBLIC_DEFAULT_LON = '13.405';
        process.env.NEXT_PUBLIC_WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
    });

    describe('getWeatherCondition', () => {
        it('returns correct condition for specific WMO codes', () => {
            expect(getWeatherCondition(0)).toEqual({ description: "Klarer Himmel", emoji: "☀️" });
            expect(getWeatherCondition(61)).toEqual({ description: "Leichter Regen", emoji: "🌧️" });
            expect(getWeatherCondition(95)).toEqual({ description: "Gewitter", emoji: "⛈️" });
        });

        it('returns fallback condition for unknown codes', () => {
            expect(getWeatherCondition(999)).toEqual({ description: "Unbekannt", emoji: "❓" });
        });
    });

    describe('fetchWeather', () => {
        it('fetches weather data successfully with given coordinates', async () => {
            const mockResponse = {
                current_weather: {
                    temperature: 22.5,
                    windspeed: 15.2,
                    weathercode: 3
                }
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const result = await fetchWeather(48.13, 11.58); // Munich coords

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.open-meteo.com/v1/forecast?latitude=48.13&longitude=11.58&current_weather=true'
            );

            expect(result).toEqual({
                temperature: 22.5,
                windSpeed: 15.2,
                weatherCode: 3
            });
        });

        it('uses fallback coordinates when none are provided', async () => {
            const mockResponse = {
                current_weather: {
                    temperature: 15.0,
                    windspeed: 10.0,
                    weathercode: 1
                }
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            await fetchWeather();

            // Should use Berlin coordinates from env defaults set in beforeEach
            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.405&current_weather=true'
            );
        });

        it('throws error when API response is not ok', async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                status: 500
            });

            await expect(fetchWeather()).rejects.toThrow('Failed to fetch weather data');
        });
    });

    describe('fetchWeatherByCity', () => {
        it('fetches geocoding and then weather for city', async () => {
            // 1. Mock Geocoding Response
            const mockGeocodeResponse = {
                results: [
                    { latitude: 51.5, longitude: -0.1 } // London coords
                ]
            };

            // 2. Mock Weather Response
            const mockWeatherResponse = {
                current_weather: {
                    temperature: 12.0,
                    windspeed: 20.5,
                    weathercode: 61 // Rain
                }
            };

            (global.fetch as any)
                .mockResolvedValueOnce({ ok: true, json: async () => mockGeocodeResponse }) // Geocoding
                .mockResolvedValueOnce({ ok: true, json: async () => mockWeatherResponse }); // Weather

            const result = await fetchWeatherByCity('London');

            // Check geocoding call
            expect(global.fetch).toHaveBeenNthCalledWith(1,
                expect.stringContaining('geocoding-api.open-meteo.com/v1/search?name=London')
            );

            // Check weather call with coords from geocoding
            expect(global.fetch).toHaveBeenNthCalledWith(2,
                'https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current_weather=true'
            );

            expect(result).toEqual({
                temperature: 12.0,
                windSpeed: 20.5,
                weatherCode: 61
            });
        });

        it('throws error when city is not found', async () => {
            const mockGeocodeResponse = {
                results: undefined // Empty results
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockGeocodeResponse
            });

            await expect(fetchWeatherByCity('UnknownCity123')).rejects.toThrow('Stadt nicht gefunden');
        });

        it('throws error when geocoding api fails', async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: false
            });

            await expect(fetchWeatherByCity('Berlin')).rejects.toThrow('Failed to fetch geocoding data');
        });
    });
});
