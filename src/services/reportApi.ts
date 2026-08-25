import { api } from './api';
import type { CitizenReport, CreateReportRequest } from '../types';

export const reportApi = {
  getAll: (params?: { status?: string; category?: string }) =>
    api.get<CitizenReport[]>('/reports', params as Record<string, string>),

  getById: (id: string) =>
    api.get<CitizenReport>(`/reports/${id}`),

  create: (data: CreateReportRequest) =>
    api.post<CitizenReport>('/reports', data),

  update: (id: string, data: Partial<CitizenReport>) =>
    api.patch<CitizenReport>(`/reports/${id}`, data),

  uploadMedia: (reportId: string, formData: FormData) =>
    api.upload<{ urls: string[] }>(`/reports/${reportId}/media`, formData),
};
