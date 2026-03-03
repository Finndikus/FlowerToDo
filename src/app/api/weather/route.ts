import { NextRequest, NextResponse } from "next/server";
import { fetchWeather, fetchWeatherByCity } from "@/lib/weatherService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    let weatherData;

    if (city) {
      weatherData = await fetchWeatherByCity(city);
    } else if (lat && lon) {
      weatherData = await fetchWeather(
        parseFloat(lat),
        parseFloat(lon)
      );
    } else {
      weatherData = await fetchWeather();
    }

    return NextResponse.json(weatherData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch weather" },
      { status: 500 }
    );
  }
}