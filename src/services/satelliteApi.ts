import { api } from './api';
import type { SatelliteObservation, TerrainAnomaly } from '../types';

export const satelliteApi = {
  getByLocation: (locationId: string) =>
    api.get<{ observations: SatelliteObservation[]; anomalies: TerrainAnomaly[] }>(
      `/satellite/${locationId}`
    ),

  getAnomalies: () =>
    api.get<{ anomalies: any[]; count: number }>('/satellite/anomalies'),
};
