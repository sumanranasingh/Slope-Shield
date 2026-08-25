import { useApi } from './useApi';
import { roadApi } from '../services/roadApi';
import { getAllRoadSegments } from '../data/roads';
import type { RoadSegment } from '../types';

export function useRoads() {
  return useApi<RoadSegment[]>(
    async () => {
      const data = await roadApi.getAll();
      return data as unknown as RoadSegment[];
    },
    getAllRoadSegments() as unknown as RoadSegment[],
    []
  );
}
