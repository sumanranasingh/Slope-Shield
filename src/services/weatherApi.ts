import { api } from './api';
import type { WeatherObservation, WeatherForecast } from '../types';

export const weatherApi = {
  getCurrent: (locationId: string) =>
    api.get<WeatherObservation>(`/weather/${locationId}`),

  getForecast: (locationId: string) =>
    api.get<WeatherForecast[]>(`/weather/${locationId}/forecast`),
};
