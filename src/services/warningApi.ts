import { api } from './api';
import type { Warning, CreateWarningRequest, UpdateWarningRequest, EscalateWarningRequest } from '../types';

export const warningApi = {
  getAll: (params?: { status?: string; severity?: string; state?: string }) =>
    api.get<Warning[]>('/warnings', params as Record<string, string>),

  getById: (id: string) =>
    api.get<Warning>(`/warnings/${id}`),

  create: (data: CreateWarningRequest) =>
    api.post<Warning>('/warnings', data),

  update: (id: string, data: UpdateWarningRequest) =>
    api.patch<Warning>(`/warnings/${id}`, data),

  acknowledge: (id: string) =>
    api.post<{ id: string; status: string; acknowledgedBy: string; acknowledgedAt: string }>(
      `/warnings/${id}/acknowledge`
    ),

  escalate: (id: string, data: EscalateWarningRequest) =>
    api.post<Warning>(`/warnings/${id}/escalate`, data),

  resolve: (id: string) =>
    api.post<{ id: string; status: string; resolvedAt: string }>(`/warnings/${id}/resolve`),
};
