# 🌤️ Wetter-API Integration Guide

Diese Integration verbindet die kostenlose **Open-Meteo API** mit FlowerToDo.

## 📋 Voraussetzungen

- Node.js 18+
- Next.js 15+

## 🚀 Installation

### 1. Dependencies installieren

```bash
npm install
```

Keine zusätzlichen Packages nötig! Die Open-Meteo API ist kostenlos und erfordert keine API-Keys.

### 2. Umgebungsvariablen konfigurieren

Die `.env.local` Datei ist bereits vorkonfiguriert. Du kannst die Standard-Koordinaten anpassen:

```env
NEXT_PUBLIC_WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
NEXT_PUBLIC_DEFAULT_LAT=52.52      # Breitengrad (Berlin)
NEXT_PUBLIC_DEFAULT_LON=13.405     # Längengrad (Berlin)
```

### 3. WeatherWidget in deine App integrieren

In `src/app/page.tsx`:

```typescript
import { WeatherWidget } from "@/components/WeatherWidget";

export default function Home() {
  return (
    <main>
      <h1>🌸 FlowerToDo</h1>
      
      {/* Wetter-Widget mit automatischem Refresh alle 30 Minuten */}
      <WeatherWidget city="Berlin" autoRefresh={30} />
    </main>
  );
}
```

## 📖 Verwendung

### WeatherWidget Komponente

```typescript
// Nach Stadt (empfohlen)
<WeatherWidget city="Berlin" autoRefresh={30} />

// Nach Koordinaten
<WeatherWidget lat={52.52} lon={13.405} autoRefresh={30} />

// Mit Standard-Koordinaten aus .env
<WeatherWidget autoRefresh={30} />
```

### useWeather Hook

```typescript
"use client";

import { useWeather } from "@/hooks/useWeather";

export function MyComponent() {
  const { weather, loading, error, refresh, description } = useWeather({
    city: "Berlin",
    autoRefresh: 30 * 60 * 1000, // 30 Minuten in Millisekunden
  });

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <div>
      <p>Temperatur: {weather?.temperature}°C</p>
      <p>Beschreibung: {description?.description}</p>
      <p>Wind: {weather?.windSpeed} km/h</p>
      <button onClick={refresh}>Aktualisieren</button>
    </div>
  );
}
}
```

### API Endpoint

Du kannst auch direkt den `/api/weather` Endpoint aufrufen:

```javascript
// Nach Stadt
fetch("/api/weather?city=Berlin")

// Nach Koordinaten
fetch("/api/weather?lat=52.52&lon=13.405")

// Mit Standard-Koordinaten
fetch("/api/weather")
```

## 🌡️ Unterstützte Wetter-Codes

Die Integration unterstützt alle WMO-Wettercodes mit deutschen Beschreibungen und Emojis:

- ☀️ Klarer Himmel
- 🌤️ Meist klar
- ⛅ Teilweise bewölkt
- ☁️ Bewölkt
- 🌫️ Nebelig
- 🌦️ Nieselregen
- 🌧️ Regen
- ⛈️ Gewitter
- 🌨️ Schnee
- ❄️ Starker Schnee

## 📁 Dateistruktur

```
src/
├── lib/
│   └── weatherService.ts       # Wetter-Service (fetchWeather, fetchWeatherByCity)
├── app/
│   └── api/
│       └── weather/
│           └── route.ts        # API Endpoint
├── hooks/
│   └── useWeather.ts           # Custom Hook für Wetter-Daten
├── components/
│   ├── WeatherWidget.tsx       # Wetter-Widget Komponente
│   └── WeatherWidget.module.css # Styling
└── types.ts                    # TypeScript Typen (WeatherData, WeatherCondition)
```

## ✨ Features

✅ Kostenlos - Keine API-Keys nötig
✅ Einfach zu verwenden
✅ Vollständig typsicher (TypeScript)
✅ Mobile-responsive
✅ Auto-Refresh Funktion
✅ Deutsche Beschreibungen
✅ Stadt-Suche mit Geocoding
✅ Koordinaten-basierte Abfragen

## 🔍 Fehlerbehandlung

Die Integration verfügt über umfassende Fehlerbehandlung:

```typescript
const { weather, loading, error, refresh, description } = useWeather({
  city: "Berlin",
});

if (error) {
  console.error("Wetterfehler:", error);
  // z.B. "Stadt nicht gefunden" oder "Failed to fetch weather"
}
```

## 🎨 Styling anpassen

Das `WeatherWidget` nutzt CSS-Module. Passe die Farben in `WeatherWidget.module.css` an:

```css
.widget {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Deine Farben hier */
}
```

## 📚 Open-Meteo API Dokumentation

Mehr Informationen: https://open-meteo.com/

## 🤝 Weitere Features

Mögliche Erweiterungen:

- [ ] 7-Tage-Vorhersage
- [ ] Wetteralerte
- [ ] Geolocation Auto-Detect
- [ ] Mehrere Standorte
- [ ] Wetter-basierte Task-Vorschläge

---

**Viel Spaß mit deiner Wetter-Integration! 🌤️**