import { api } from './api';
import type { DashboardSummary, RiskAnalytics } from '../types';

export const dashboardApi = {
  getSummary: () => api.get<DashboardSummary>('/dashboard/summary'),
};

export const analyticsApi = {
  getRiskAnalytics: (timeRange?: string) =>
    api.get<RiskAnalytics>('/analytics/risk', timeRange ? { time_range: timeRange } : undefined),
  getRainfallAnalytics: (timeRange?: string) =>
    api.get<{ data: Record<string, number | string>[] }>('/analytics/rainfall', timeRange ? { time_range: timeRange } : undefined),
  getIncidentAnalytics: (timeRange?: string) =>
    api.get<{ data: Record<string, number | string>[] }>('/analytics/incidents', timeRange ? { time_range: timeRange } : undefined),
};
