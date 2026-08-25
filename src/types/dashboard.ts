import type { RiskLevel, DataSourceMeta } from './risk';

export interface DashboardSummary {
  totalMonitoredLocations: number;
  criticalRiskLocations: number;
  highRiskLocations: number;
  moderateRiskLocations: number;
  lowRiskLocations: number;
  activeWarnings: number;
  criticalWarnings: number;
  affectedRoads: number;
  recentIncidents: number;
  regionalRiskLevel: RiskLevel;
  riskTrend: 'increasing' | 'stable' | 'decreasing';
  rainfallTrend: 'increasing' | 'stable' | 'decreasing';
  averageRiskScore: number;
  actionsRequired: ActionRequired[];
  systemStatus: SystemStatus;
  dataSource: DataSourceMeta;
}

export interface ActionRequired {
  id: string;
  priority: 'immediate' | 'high' | 'routine';
  locationName: string;
  state: string;
  action: string;
  riskScore: number;
  riskLevel: RiskLevel;
}

export interface SystemStatus {
  monitoringStationsOnline: number;
  monitoringStationsTotal: number;
  lastDataSync: string;
  weatherProviderStatus: 'connected' | 'degraded' | 'unavailable';
  satellitePassAge: string;          // e.g. "14 minutes ago"
  mlModelVersion: string;
  mlModelStatus: 'active' | 'retraining' | 'unavailable';
}

// ---------------------------------------------------------------------------
// Analytics aggregates
// ---------------------------------------------------------------------------

export interface RiskAnalytics {
  riskDistribution: { name: string; value: number; color: string }[];
  stateRiskData: { state: string; avgRisk: number; highRiskZones: number; abbrev: string }[];
  riskTrendData: Record<string, number | string>[];
  rainfallRiskCorrelation: { date: string; rainfall: number; risk: number }[];
  monthlyTrendData: { month: string; risk: number; rainfall: number }[];
  warningTrend: { date: string; count: number }[];
  incidentTrend: { month: string; count: number }[];
  dataSource: DataSourceMeta;
}
