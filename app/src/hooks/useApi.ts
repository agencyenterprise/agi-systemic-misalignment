import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import type { Prompt, MisalignmentStats, GroupSummary, LoadingState } from '../types/api';

// Generic hook for API calls with loading state
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): LoadingState & { data: T | null } {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setIsLoading(true);
    setError(undefined);

    apiCall()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, dependencies);

  return { data, isLoading, error };
}

// Specific hooks for common API calls
export function usePrompts() {
  return useApi<Prompt[]>(() => apiClient.getPrompts());
}

export function useGroups() {
  return useApi<string[]>(() => apiClient.getGroups());
}

export function useMisalignmentStats(promptIdx: number | null) {
  return useApi<MisalignmentStats>(() => apiClient.getMisalignmentStats(promptIdx!), [promptIdx]);
}

export function useGroupSummary(promptIdx: number | null, group: string | null) {
  return useApi<GroupSummary>(
    () => apiClient.getGroupSummary(promptIdx!, group!),
    [promptIdx, group]
  );
}

// Hook for making manual API calls
export function useManualApi<T>(): [
  (apiCall: () => Promise<T>) => Promise<void>,
  LoadingState & { data: T | null },
] {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const execute = async (apiCall: () => Promise<T>) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return [execute, { data, isLoading, error }];
}
