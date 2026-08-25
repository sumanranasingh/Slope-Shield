import type { RiskLevel, DataSourceMeta } from './risk';

export type RoadOperationalStatus = 'Open' | 'Restricted' | 'Closed' | 'Under Inspection';
export type RoadAuthority = 'BRO' | 'NHIDCL' | 'State PWD' | 'NHAI' | 'NFR Railway';
export type RoadPriority = 'P1 — Immediate' | 'P2 — High' | 'P3 — Monitor' | 'P4 — Normal';

export interface RoadSegment {
  id: string;
  highwayCode: string;
  name: string;
  state: string;
  startPoint: string;
  endPoint: string;
  lengthKm: number;
  riskScore: number;
  riskLevel: RiskLevel;
  priority?: RoadPriority | string;
  landslideProbability?: number;
  heavyRainfallForecast?: boolean;
  expectedRainfallMm?: number;
  nearbyHistoricalEvents?: number;
  status: RoadOperationalStatus;
  recommendedAction?: string;
  vulnerablePoints?: string[];
  lastInspected: string;
  authority: RoadAuthority | string;
  coordinates?: [number, number][];
  alternateRoute?: string;
  blockageStatus?: string;
  incidentCount?: number;
  responseStatus?: string;
  dataSource?: DataSourceMeta;
}

export interface Highway {
  id: string;
  code: string;
  name: string;
  totalLengthKm: number;
  highRiskSectionsCount: number;
  segments: RoadSegment[];
}

export interface InfrastructureExposure {
  type: string;
  exposed: string;
  criticalHotspots: number;
  riskIndex: number;
}
