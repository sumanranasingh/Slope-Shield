import { api } from './api';
import type { Highway, RoadSegment } from '../types';

export const roadApi = {
  getAll: () => api.get<Highway[]>('/roads'),
  getById: (id: string) => api.get<RoadSegment>(`/roads/${id}`),
};
