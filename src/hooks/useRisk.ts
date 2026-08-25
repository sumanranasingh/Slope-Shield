import { useState, useCallback } from 'react';
import { riskApi, PredictRiskRequest } from '../services/riskApi';
import type { RiskPrediction } from '../types';

export interface UseRiskReturn {
  predict: (features: PredictRiskRequest) => Promise<RiskPrediction | null>;
  data: RiskPrediction | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useRisk(): UseRiskReturn {
  const [data, setData] = useState<RiskPrediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(async (features: PredictRiskRequest): Promise<RiskPrediction | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await riskApi.predict(features);
      setData(result);
      return result;
    } catch (err: any) {
      const msg = err?.message || 'Failed to compute risk prediction';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { predict, data, isLoading, error, reset };
}
