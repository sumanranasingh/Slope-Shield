import { useApi } from './useApi';
import { warningApi } from '../services/warningApi';
import { warnings as demoWarnings } from '../data/warnings';
import type { Warning } from '../types';

export function useWarnings(params?: { status?: string; severity?: string; state?: string }) {
  return useApi<Warning[]>(
    () => warningApi.getAll(params),
    demoWarnings as unknown as Warning[],
    [params?.status, params?.severity, params?.state]
  );
}
