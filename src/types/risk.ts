/**
 * Core risk domain types for Slope-Shield AI.
 *
 * Risk scoring uses a 0–100 scale with four severity bands.
 * Every data-driven screen MUST carry a DataSource label so the UI
 * never misrepresents development data as live sensor telemetry.
 */

// ---------------------------------------------------------------------------
// Data-source provenance
// ---------------------------------------------------------------------------

export type DataSource = 'LIVE' | 'FORECAST' | 'HISTORICAL' | 'DEMO';

export interface DataSourceMeta {
  source: DataSource;
  lastUpdated: string;       // ISO 8601
  provider?: string;         // e.g. "IMD", "OpenWeatherMap", "Development Seed"
  modelVersion?: string;     // e.g. "rf-v0.1-dev"
}

// ---------------------------------------------------------------------------
// Risk levels & scoring
// ---------------------------------------------------------------------------

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface RiskScore {
  score: number;             // 0–100
  level: RiskLevel;
  probability: number;       // 0.0–1.0
}

/** Mapping: 0–39 Low, 40–59 Moderate, 60–79 High, 80–100 Critical */
export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Moderate';
  return 'Low';
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'Critical': return '#ef4444';
    case 'High':     return '#f97316';
    case 'Moderate': return '#eab308';
    case 'Low':      return '#22c55e';
  }
}

export function riskBgClass(level: RiskLevel): string {
  switch (level) {
    case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'High':     return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'Moderate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'Low':      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  }
}

// ---------------------------------------------------------------------------
// Risk prediction (from ML / risk engine)
// ---------------------------------------------------------------------------

export interface RiskFactor {
  name: string;
  contribution: number;      // percentage 0–100
  color: string;
}

export interface PredictRiskRequest {
  locationId: string;
  rainfall24h: number;
  rainfall72h: number;
  rainfall7d: number;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  slopeDegree: number;
  elevation: number;
  historicalLandslideCount: number;
  distanceToRoad: number;
  distanceToDrainage: number;
  landCover: string;
  geologicalFactor: number;
  groundMovement: number;
}

export interface RiskPrediction {
  id: string;
  locationId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  riskProbability: number;
  riskFactors: RiskFactor[];
  recommendedAction: string;
  explanation: string[];      // human-readable lines derived from model
  predictionTimestamp: string;
  modelVersion: string;
  dataSource: DataSourceMeta;
}

export type PredictRiskResponse = RiskPrediction;

// ---------------------------------------------------------------------------
// Risk trend (for charts)
// ---------------------------------------------------------------------------

export interface RiskTrendPoint {
  timestamp: string;
  score: number;
  level: RiskLevel;
}
