import { useApi } from './useApi';
import { weatherApi } from '../services/weatherApi';
import type { WeatherObservation } from '../types';

export function useWeather(locationId: string | undefined) {
  return useApi<WeatherObservation | null>(
    async () => {
      if (!locationId) return null;
      return weatherApi.getCurrent(locationId);
    },
    null,
    [locationId]
  );
}
