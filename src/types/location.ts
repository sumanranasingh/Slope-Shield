import type { RiskLevel, RiskFactor, DataSourceMeta } from './risk';

// ---------------------------------------------------------------------------
// Location status
// ---------------------------------------------------------------------------

export type LocationStatus = 'Active' | 'Monitoring' | 'Alert' | 'Inactive';

// ---------------------------------------------------------------------------
// Core location (list view)
// ---------------------------------------------------------------------------

export interface Location {
  id: string;
  name: string;
  district: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
  elevation: number;
  slope: number;
  landCover: string;
  geologicalClass: string;
  riskScore: number;
  riskLevel: RiskLevel;
  rainfall: string;
  rainfallMm: number;
  lastUpdated: string;
  status: LocationStatus;
  dataCoverage: number;
}

// ---------------------------------------------------------------------------
// Historical event & Sensor telemetry
// ---------------------------------------------------------------------------

export interface HistoricalEvent {
  date: string;
  type: string;
  severity: string;
  description: string;
}

export interface SensorReading {
  id: string;
  locationId: string;
  type: string;
  depthM?: number;
  unit: string;
  currentReading: number;
  readingStatus: 'NORMAL' | 'CRITICAL' | 'WARNING';
  timestamp: string;
  dataFreshness: string;
}

// ---------------------------------------------------------------------------
// Location detail (deep-dive page)
// ---------------------------------------------------------------------------

export interface LocationDetail extends Location {
  historicalEvents: HistoricalEvent[];
  forecast: {
    hours24: number;
    hours48: number;
    hours72: number;
  };
  aiRecommendation: string;
  riskFactors: RiskFactor[];
  sensors?: SensorReading[];
  environmentalConditions?: {
    rainfall24h: number;
    rainfall72h: number;
    rainfall7d: number;
    soilMoisture: number;
    temperature: number;
    humidity: number;
    groundMovement: number;
  };
  historicalLandslideCount?: number;
  dataSource: DataSourceMeta;
}

// ---------------------------------------------------------------------------
// Pipeline Analysis Output
// ---------------------------------------------------------------------------

export interface LocationAnalysisResult {
  locationName: string;
  district: string;
  state: string;
  coordinates: [number, number];
  elevationM: number;
  slopeDeg: number;
  geology: string;
  weather: Record<string, any>;
  riskScore: number;
  riskLevel: RiskLevel;
  riskProbability: number;
  riskFactors: RiskFactor[];
  explanations: string[];
  actionDirective: string;
  nearbyInfrastructure: Array<{
    name: string;
    code: string;
    type: string;
    authority: string;
    distanceKm: number;
    exposureLevel: string;
  }>;
  historicalEventsCount: number;
  dataSource: DataSourceMeta;
}
