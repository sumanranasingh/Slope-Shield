/**
 * Generic data-fetching hook with loading/error/retry states.
 * Used by all domain-specific hooks to avoid duplicating fetch logic.
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
  lastUpdated: string | null;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  fallback?: T,
  deps: unknown[] = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(fallback ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(!fallback);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const execute = useCallback(async () => {
    // Only show full loading skeleton if we don't already have data/fallback
    setData((current) => {
      if (!current && !fallbackRef.current) {
        setIsLoading(true);
      }
      return current;
    });
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setData((current) => current || fallbackRef.current || null);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, isLoading, error, retry: execute, lastUpdated };
}
