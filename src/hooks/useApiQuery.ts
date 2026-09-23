"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

export interface UseApiQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
}

/**
 * Thin, purpose-built wrapper around TanStack Query's `useQuery` for
 * single-shot, filter-driven reads (e.g. the Discover tabs). Keeps the
 * previous result on screen while a new filter combination loads
 * (`placeholderData: keepPreviousData`) so switching tabs/filters feels
 * optimistic instead of flashing back to an empty state.
 */
export function useApiQuery<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[],
  enabled = true
): UseApiQueryResult<T> {
  const { data, isLoading, isError, error } = useQuery<T>({
    queryKey: ["api-query", ...deps],
    queryFn: fetcher,
    enabled,
    placeholderData: keepPreviousData,
  });

  return {
    data: data ?? null,
    loading: enabled && isLoading,
    error: isError ? error : null,
  };
}
