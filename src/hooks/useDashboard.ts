import { useApi } from './useApi';
import { dashboardApi } from '../services/dashboardApi';
import { analyticsApi } from '../services/dashboardApi';
import { locations } from '../data/locations';
import { warnings } from '../data/warnings';
import { highways } from '../data/roads';
import type { DashboardSummary, RiskAnalytics } from '../types';

function buildDemoSummary(): DashboardSummary {
  const critical = locations.filter(l => l.riskLevel === 'Critical').length;
  const high = locations.filter(l => l.riskLevel === 'High').length;
  const moderate = locations.filter(l => l.riskLevel === 'Moderate').length;
  const low = locations.filter(l => l.riskLevel === 'Low').length;
  const activeWarnings = warnings.filter(w => w.status === 'Active').length;
  const critWarnings = warnings.filter(w => w.status === 'Active' && w.severity === 'Critical').length;
  const avgRisk = Math.round(locations.reduce((s, l) => s + l.riskScore, 0) / locations.length);

  return {
    totalMonitoredLocations: locations.length,
    criticalRiskLocations: critical,
    highRiskLocations: high,
    moderateRiskLocations: moderate,
    lowRiskLocations: low,
    activeWarnings,
    criticalWarnings: critWarnings,
    affectedRoads: highways.flatMap(h => h.segments).filter(s => s.riskLevel === 'Critical' || s.riskLevel === 'High').length,
    recentIncidents: 3,
    regionalRiskLevel: 'High',
    riskTrend: 'increasing',
    rainfallTrend: 'increasing',
    averageRiskScore: avgRisk,
    actionsRequired: locations
      .filter(l => l.riskScore >= 75)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map(l => ({
        id: l.id,
        priority: l.riskScore >= 85 ? 'immediate' as const : 'high' as const,
        locationName: l.name,
        state: l.state,
        action: (l as any).aiRecommendation || 'Field inspection recommended',
        riskScore: l.riskScore,
        riskLevel: l.riskLevel,
      })),
    systemStatus: {
      monitoringStationsOnline: locations.length,
      monitoringStationsTotal: locations.length,
      lastDataSync: new Date().toISOString(),
      weatherProviderStatus: 'unavailable',
      satellitePassAge: 'N/A — demo mode',
      mlModelVersion: 'rf-v0.1-dev',
      mlModelStatus: 'unavailable',
    },
    dataSource: {
      source: 'DEMO',
      lastUpdated: new Date().toISOString(),
      provider: 'Development Seed Data',
    },
  };
}

export function useDashboard() {
  return useApi<DashboardSummary>(
    () => dashboardApi.getSummary(),
    buildDemoSummary(),
    []
  );
}

export function useAnalytics(timeRange?: string) {
  return useApi<RiskAnalytics | null>(
    () => analyticsApi.getRiskAnalytics(timeRange),
    null,
    [timeRange]
  );
}
