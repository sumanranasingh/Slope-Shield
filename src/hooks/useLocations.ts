import { useApi } from './useApi';
import { locationApi } from '../services/locationApi';
import { locations as demoLocations, getLocationById as getDemoLocation } from '../data/locations';
import type { Location, LocationDetail } from '../types';

/** Convert existing demo data to the Location type (already compatible). */
function adaptDemoLocations(): Location[] {
  return demoLocations as unknown as Location[];
}

export function useLocations(params?: { state?: string; risk_level?: string; status?: string }) {
  return useApi<Location[]>(
    () => locationApi.getAll(params),
    adaptDemoLocations(),
    [params?.state, params?.risk_level, params?.status]
  );
}

export function useLocationDetail(id: string | undefined) {
  return useApi<LocationDetail | null>(
    async () => {
      if (!id) return null;
      return locationApi.getById(id);
    },
    id ? (getDemoLocation(id) as unknown as LocationDetail) ?? null : null,
    [id]
  );
}
