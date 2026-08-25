import type { DataSourceMeta, RiskLevel } from './risk';

export type SatelliteSource = 'Sentinel-1' | 'Sentinel-2' | 'RISAT-1A' | 'Cartosat-3';

export interface SatelliteObservation {
  id: string;
  locationId: string;
  source: SatelliteSource;
  timestamp: string;
  imageReference: string;       // URL or path to imagery
  observationType: string;      // e.g. "SAR Interferogram", "Optical NDVI"
  resolution: string;           // e.g. "5m"
  cloudCover?: number;          // % (optical only)
  dataSource: DataSourceMeta;
}

export interface TerrainAnomaly {
  id: string;
  location: string;
  state: string;
  coordinates: string;
  satellite: string;
  detectionDate: string;
  confidence: number;           // 0–100
  displacementCm: number;       // negative = subsidence
  areaHectares: number;
  type: string;                 // e.g. "Progressive creeping failure"
  severity: RiskLevel;
  dataSource: DataSourceMeta;
}
