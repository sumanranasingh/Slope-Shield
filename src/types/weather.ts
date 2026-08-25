import type { DataSourceMeta } from './risk';

export interface WeatherObservation {
  locationId: string;
  timestamp: string;
  temperature: number;       // °C
  humidity: number;          // %
  rainfall1h: number;       // mm
  rainfall24h: number;      // mm
  rainfall72h: number;      // mm
  rainfall7d: number;       // mm
  windSpeed: number;        // km/h
  windDirection: string;
  pressure: number;         // hPa
  visibility: number;       // km
  cloudCover: number;       // %
  condition: string;        // e.g. "Heavy Rain", "Overcast"
  dataSource: DataSourceMeta;
}

export interface WeatherForecast {
  locationId: string;
  forecastHour: number;     // +24, +48, +72
  expectedRainfallMm: number;
  expectedTemperature: number;
  probability: number;      // 0–1
  condition: string;
  dataSource: DataSourceMeta;
}

export interface SoilObservation {
  locationId: string;
  timestamp: string;
  soilMoisture: number;     // % volumetric water content
  porePressure: number;     // kPa
  soilTemperature: number;  // °C
  saturationLevel: string;  // "Normal" | "Elevated" | "Critical"
  dataSource: DataSourceMeta;
}
