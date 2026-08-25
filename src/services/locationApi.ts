import { api } from './api';
import type { Location, LocationDetail, LocationAnalysisResult } from '../types';

export const locationApi = {
  getAll: (params?: { state?: string; risk_level?: string; status?: string; search?: string }) =>
    api.get<Location[]>('/locations', params as Record<string, string>),

  getById: (id: string) =>
    api.get<LocationDetail>(`/locations/${id}`),

  getRiskHistory: (id: string) =>
    api.get<{ locationId: string; history: { timestamp: string; score: number; rainfall?: number }[] }>(
      `/locations/${id}/risk-history`
    ),

  analyze: (payload: { query?: string; latitude?: number; longitude?: number; rainfallMultiplier?: number }) =>
    api.post<LocationAnalysisResult>('/locations/analyze', payload),

  geocode: (query: string) =>
    api.get<{ found: boolean; location?: any; matches?: any[] }>(`/locations/geocode?q=${encodeURIComponent(query)}`),
};
