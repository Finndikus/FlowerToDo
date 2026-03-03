"use client";

import React from "react";
import { useWeather } from "@/hooks/useWeather";
import styles from "./WeatherWidget.module.css";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";

interface WeatherWidgetProps {
    city?: string;
    lat?: number;
    lon?: number;
    autoRefresh?: number; // In minutes, not ms, according to docs
}

export function WeatherWidget({ city, lat, lon, autoRefresh }: WeatherWidgetProps) {
    const { weather, description, loading, error, refresh } = useWeather({
        city,
        lat,
        lon,
        autoRefresh: autoRefresh ? autoRefresh * 60 * 1000 : undefined,
    });

    if (loading && !weather) {
        return (
            <div className={`${styles.widget} animate-pulse flex items-center justify-center`}>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${styles.widget} ${styles.error} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Wetter konnte nicht geladen werden</span>
                </div>
                <button onClick={refresh} title="Erneut versuchen" className={styles.refreshBtn}>
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>
        );
    }

    if (!weather || !description) return null;

    return (
        <div className={styles.widget}>
            <div className={styles.content}>
                <div className={styles.mainInfo}>
                    <span className={styles.emoji}>{description.emoji}</span>
                    <div className={styles.temperature}>
                        {Math.round(weather.temperature)}°C
                    </div>
                </div>

                <div className={styles.details}>
                    <p className={styles.descText}>{description.description}</p>
                    <p className={styles.windText}>💨 {weather.windSpeed} km/h</p>
                </div>
            </div>

            <button onClick={refresh} title="Aktualisieren" className={styles.refreshBtn}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
    );
}
