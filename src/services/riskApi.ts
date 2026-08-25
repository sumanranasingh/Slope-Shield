import { api } from './api';
import type { RiskPrediction } from '../types';

export interface PredictRiskRequest {
  locationId: string;
  rainfall24h: number;
  rainfall72h: number;
  rainfall7d: number;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  slopeDegree: number;
  elevation: number;
  historicalLandslideCount: number;
  distanceToRoad: number;
  distanceToDrainage: number;
  landCover: string;
  geologicalFactor: number;
  groundMovement: number;
}

export const riskApi = {
  predict: (data: PredictRiskRequest) =>
    api.post<RiskPrediction>('/predict-risk', data),
};
