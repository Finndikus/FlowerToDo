import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherWidget } from '@/components/WeatherWidget';
import * as useWeatherHook from '@/hooks/useWeather';

// Mock the hook
vi.mock('@/hooks/useWeather', () => ({
    useWeather: vi.fn(),
}));

describe('WeatherWidget Component', () => {
    const mockRefresh = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state correctly', () => {
        vi.spyOn(useWeatherHook, 'useWeather').mockReturnValue({
            weather: null,
            description: null,
            loading: true,
            error: null,
            refresh: mockRefresh,
        });

        const { container } = render(<WeatherWidget city="Berlin" />);

        // The loader has the animate-pulse class
        expect(container.firstChild).toHaveClass('animate-pulse');
    });

    it('renders error state correctly', () => {
        vi.spyOn(useWeatherHook, 'useWeather').mockReturnValue({
            weather: null,
            description: null,
            loading: false,
            error: 'Failed to fetch weather data',
            refresh: mockRefresh,
        });

        render(<WeatherWidget city="Berlin" />);

        expect(screen.getByText('Wetter konnte nicht geladen werden')).toBeInTheDocument();
    });

    it('calls refresh when error retry button is clicked', () => {
        vi.spyOn(useWeatherHook, 'useWeather').mockReturnValue({
            weather: null,
            description: null,
            loading: false,
            error: 'Error',
            refresh: mockRefresh,
        });

        render(<WeatherWidget city="Berlin" />);
        const button = screen.getByRole('button', { name: /Erneut versuchen/i });

        fireEvent.click(button);
        expect(mockRefresh).toHaveBeenCalledTimes(1);
    });

    it('renders weather data correctly', () => {
        vi.spyOn(useWeatherHook, 'useWeather').mockReturnValue({
            weather: { temperature: 22.4, windSpeed: 15.5, weatherCode: 1 },
            description: { description: 'Meist klar', emoji: '🌤️' },
            loading: false,
            error: null,
            refresh: mockRefresh,
        });

        render(<WeatherWidget city="Berlin" />);

        expect(screen.getByText('🌤️')).toBeInTheDocument();
        expect(screen.getByText('22°C')).toBeInTheDocument(); // Math.round(22.4)
        expect(screen.getByText('Meist klar')).toBeInTheDocument();
        expect(screen.getByText('💨 15.5 km/h')).toBeInTheDocument();
    });

    it('calls refresh when update button is clicked in success state', () => {
        vi.spyOn(useWeatherHook, 'useWeather').mockReturnValue({
            weather: { temperature: 20, windSpeed: 10, weatherCode: 1 },
            description: { description: 'Meist klar', emoji: '🌤️' },
            loading: false,
            error: null,
            refresh: mockRefresh,
        });

        render(<WeatherWidget city="Berlin" />);
        const button = screen.getByRole('button', { name: /Aktualisieren/i });

        fireEvent.click(button);
        expect(mockRefresh).toHaveBeenCalledTimes(1);
    });

    it('adds animate-spin to refresh icon when loading is true but there is cached weather', () => {
        vi.spyOn(useWeatherHook, 'useWeather').mockReturnValue({
            weather: { temperature: 20, windSpeed: 10, weatherCode: 1 },
            description: { description: 'Meist klar', emoji: '🌤️' },
            loading: true, // loading while showing old data
            error: null,
            refresh: mockRefresh,
        });

        const { container } = render(<WeatherWidget city="Berlin" />);

        // Find the svg inside the button, should have animate-spin
        const button = screen.getByRole('button', { name: /Aktualisieren/i });
        const svg = button.querySelector('svg');
        expect(svg).toHaveClass('animate-spin');
    });

    it('returns null if neither loading nor error and no weather data exists', () => {
        vi.spyOn(useWeatherHook, 'useWeather').mockReturnValue({
            weather: null,
            description: null,
            loading: false,
            error: null,
            refresh: mockRefresh,
        });

        const { container } = render(<WeatherWidget city="Berlin" />);
        expect(container).toBeEmptyDOMElement();
    });
});
